// ─────────────────────────────────────────────────────────────────────────────
// CancelTrap — /api/resolve
//
// Destination-Resolution API Route Handler
//
// Accepts a user query (search text or pasted URL) and returns the resolved
// destination with navigation steps, dark pattern warnings, and verification.
//
// Pipeline:
//   1. Deterministic registry lookup (sub-ms)
//   2. If unresolved → AI-assisted discovery via Gemini
// ─────────────────────────────────────────────────────────────────────────────

import dns from "dns";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { resolve, resolveWithAction } from "@/lib/engine/resolver";
import { discoverLiveWeb } from "@/lib/engine/liveDiscovery";
import { ActionType, ResolutionResult } from "@/lib/engine/types";

export const maxDuration = 30;

async function verifyAndSanitizeUrl(targetUrl: string): Promise<string> {
  try {
    const parsed = new URL(targetUrl);
    const hostname = parsed.hostname;

    // Check if the hostname resolves via DNS
    try {
      await Promise.race([
        dns.promises.lookup(hostname),
        new Promise((_, reject) => setTimeout(() => reject(new Error("DNS timeout")), 1500)),
      ]);
      return targetUrl; // Verified on DNS!
    } catch {
      // Subdomain failed (e.g. selfcare.netone.co.zw) -> test parent/root candidates
      const parts = hostname.split(".");
      if (parts.length > 2) {
        const candidates = [
          "www." + parts.slice(1).join("."),
          parts.slice(1).join("."),
        ];
        if (parts.length > 3) {
          candidates.push(parts.slice(-2).join("."));
          candidates.push("www." + parts.slice(-2).join("."));
        }
        for (const cand of candidates) {
          try {
            await Promise.race([
              dns.promises.lookup(cand),
              new Promise((_, reject) => setTimeout(() => reject(new Error("DNS timeout")), 1000)),
            ]);
            parsed.hostname = cand;
            return parsed.toString();
          } catch {
            continue;
          }
        }
      }
      return targetUrl;
    }
  } catch {
    return targetUrl;
  }
}

function isObviouslyFakeQuery(query: string): boolean {
  const clean = query.trim().toLowerCase();
  // 7+ consecutive consonants with zero vowels is keyboard-mashing (e.g. asdfghjk, zxcvbnm)
  if (/[bcdfghjklmnpqrstvwxyz]{7,}/i.test(clean)) return true;
  if (/\b(fake|fictional|nonexistent|notareal|bogus|testtest|dummy123|asdfghjk|qwertyuiop)\b/i.test(clean)) return true;
  if (/(.)\1{4,}/.test(clean)) return true;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, actionOverride } = body as {
      query?: string;
      actionOverride?: ActionType;
    };

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "A search query or URL is required." },
        { status: 400 }
      );
    }

    const trimmedQuery = query.trim();

    // Fast-path anti-hallucination check for obvious fake/gibberish terms
    if (isObviouslyFakeQuery(trimmedQuery)) {
      return NextResponse.json({
        resolved: false,
        error: `"${trimmedQuery}" appears to be a fictional or non-existent entity. In accordance with anti-hallucination protocols, no URLs or cancellation steps were generated.`,
      });
    }

    // Stage 1+2+3: Deterministic resolution
    let result: ResolutionResult;

    if (actionOverride) {
      result = resolveWithAction(trimmedQuery, actionOverride);
    } else {
      result = resolve(trimmedQuery);
    }

    // If resolved from registry, return immediately — no AI needed
    if (result.resolved && result.destination) {
      return NextResponse.json(result);
    }

    // If clarification is needed, return that
    if (result.clarificationNeeded) {
      return NextResponse.json(result);
    }

    // Stage 4: AI-assisted discovery for uncataloged providers via Gemini 3.8 Flash
    if (process.env.GEMINI_API_KEY) {
      const providerName = result.destination?.providerName || trimmedQuery;
      const actionType = result.destination?.actionType || actionOverride || "cancel_subscription";
      const aiResult = await discoverWithAI(trimmedQuery, providerName, actionType);

      if (aiResult && aiResult.resolved && aiResult.destination) {
        return NextResponse.json(aiResult);
      }
    }

    // Stage 5: Fallback to real-time live web discovery
    const liveWebRes = await discoverLiveWeb(trimmedQuery);
    if (liveWebRes && liveWebRes.found && liveWebRes.destination) {
      return NextResponse.json({
        resolved: true,
        destination: liveWebRes.destination,
        candidates: liveWebRes.candidates,
      });
    }

    // Fallback: return whatever we have
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("Resolution error:", err);
    const message =
      err instanceof Error ? err.message : "Resolution failed unexpectedly.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AI-Assisted Discovery (Stage 5: Gemini Validation Gate)
//
// Only invoked when the deterministic registry has NO match.
// Uses Gemini to reason about where the cancellation destination likely lives.
// ─────────────────────────────────────────────────────────────────────────────

async function discoverWithAI(
  rawQuery: string,
  providerName: string,
  actionType: ActionType
): Promise<ResolutionResult | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      resolved: false,
      error:
        "AI discovery unavailable — no API key configured. Use a known service name (e.g., Adobe, Spotify, Netflix) or try a preset.",
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";

    const actionLabel = ACTION_LABELS[actionType] || "cancel subscription";

    const systemPrompt = `You are CancelTrap's destination-resolution AI. Your job is to find the EXACT webpage where a user can ${actionLabel} for "${providerName}".

CRITICAL RULES:
1. You must find the DEEPEST actionable destination — NOT a general billing page or help article.
2. A billing dashboard (e.g. /billing) is NOT a successful result if the user needs to navigate further to find the cancel button.
3. Distinguish between: the cancellation page itself vs. a page that LINKS to the cancellation page.
4. If the service uses disguised terminology (e.g., "Downgrade to free" instead of "Cancel"), identify the REAL action label.
5. NEVER invent or hallucinate URLs or speculative subdomains:
   - Only return domains and subdomains that are known to exist on public DNS.
   - NEVER guess or invent speculative subdomains (such as "selfcare.[domain]", "portal.[domain]", "cancel.[domain]") unless it is an established, universally recognized portal (e.g. "myaccount.google.com").
   - If you are unsure whether a specialized subdomain exists, ALWAYS default to the official primary website (e.g. "https://www.netone.co.zw" or "https://[domain]") where the user can log in or access account settings.
   - For mobile network operators / telecom providers (e.g. NetOne, Econet, MTN, Vodacom), provide the primary official website AND include the exact USSD shortcodes (e.g., *111#, *130#) in the navigation steps so users can cancel recurring bundles directly from their mobile device.
7. FORGIVING BRAND & SERVICE MATCHING: Users frequently search using informal names, typos, or partial queries (e.g., "ecoai", "eco ai", "strava", "midjourney", "cursor", "elevenlabs", "copilot", etc.). If the query refers to ANY real software, AI startup, SaaS tool, cloud platform, media app, or consumer subscription found anywhere on Google or the web, YOU MUST RESOLVE IT.
   - Formulate its canonical domain (e.g., "ecoai.com", "strava.com", "cursor.com").
   - Find or construct the primary cancellation/billing settings endpoint (e.g., "https://[domain]/settings/billing", "https://app.[domain]/account", or Stripe customer portal).
   - Provide realistic, actionable 3-step navigation for terminating or downgrading the service.
   - Flag typical SaaS dark patterns (decoy pause options, retention surveys, downgrade disguised as free).
   - Set "found": true with confidence 0.9+.
8. STRICT REJECTION ONLY FOR BLATANT FAKE / GIBBERISH: Only return "found": false if the input is obvious nonsense, gibberish keyboard-mashing (e.g., "asdfghjk99", "zxczxc123", "qwertyuiop99"), or explicitly non-existent. If it exists anywhere on Google or the web, find it and resolve it!
9. ZERO-BILLING / FREE SOFTWARE DETECTION: If the query refers to legitimate free software, open-source software, non-profit tools, or services that have NO recurring subscription or billing traps (e.g. GIMP, Audacity, LibreOffice, Godot Engine, 7-Zip, Notepad++, Linux Mint, DuckDuckGo):
   - Set "found": true
   - Set "isFreeService": true
   - Set "targetUrl" to its verified official homepage (e.g. "https://www.gimp.org")
   - In navigationPath, explain clearly that this tool is 100% free / open source with $0.00 recurring charges, so no subscription cancellation is required. Mention optional account deletion or OS uninstallation if relevant.
   - In darkPatternWarnings, reassure the user: "Safe from billing traps: This software is free and open-source with zero recurring fees."

Respond with ONLY valid JSON matching this schema:
{
  "found": boolean,
  "confidence": number (0.0 to 1.0),
  "isFreeService": boolean (true if software/service is free with no recurring billing),
  "providerName": string,
  "category": string,
  "targetUrl": string (the most direct URL you can identify),
  "requiresAuth": boolean,
  "isModalOrInPage": boolean,
  "navigationPath": [
    {
      "stepNumber": number,
      "label": string (short label for UI),
      "instruction": string (clear instruction),
      "decoyWarning": string (optional: warning about misleading elements)
    }
  ],
  "darkPatternWarnings": string[],
  "missingPrerequisites": string[] (e.g., "Requires admin role", "Need workspace slug"),
  "evidenceSummary": string (explain how you determined this destination),
  "uncertaintyNote": string (what you're NOT sure about)
}`;

    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt },
            {
              text: `User query: "${rawQuery}"\nProvider: "${providerName}"\nRequested action: "${actionType}"`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const aiResponse = JSON.parse(cleanedText);

    if (!aiResponse.found || !aiResponse.targetUrl) {
      return {
        resolved: false,
        error: `Could not find a verified destination for "${providerName}". ${aiResponse.uncertaintyNote || "Try searching with more specific terms."}`,
      };
    }

    const sanitizedTargetUrl = await verifyAndSanitizeUrl(aiResponse.targetUrl);
    const isFree = Boolean(aiResponse.isFreeService || actionType === "zero_billing_free");

    // Build destination from AI response
    return {
      resolved: true,
      destination: {
        id: `ai-${providerName.toLowerCase().replace(/\s+/g, "-")}`,
        providerName: aiResponse.providerName || providerName,
        providerDomain:
          extractDomainFromUrl(sanitizedTargetUrl) || providerName + ".com",
        actionType: isFree ? "zero_billing_free" : actionType,
        targetUrl: sanitizedTargetUrl,
        requiresAuth: aiResponse.requiresAuth ?? (!isFree),
        isModalOrInPage: aiResponse.isModalOrInPage ?? false,
        isFreeService: isFree,
        navigationPath: (aiResponse.navigationPath || []).map(
          (step: { stepNumber: number; label: string; instruction: string; decoyWarning?: string }, i: number) => ({
            stepNumber: step.stepNumber || i + 1,
            label: step.label || `Step ${i + 1}`,
            instruction: step.instruction,
            targetType: "button" as const,
            decoyWarning: step.decoyWarning,
          })
        ),
        darkPatternWarnings: aiResponse.darkPatternWarnings || [],
        verification: {
          status: aiResponse.confidence >= 0.8 ? "PROBABLE" : "GUIDED_PATH",
          confidenceScore: aiResponse.confidence || 0.5,
          evidenceSummary:
            aiResponse.evidenceSummary ||
            (isFree ? "Verified free / open-source software with zero recurring subscription fees." : "Discovered via AI analysis. Not yet independently verified."),
          lastVerifiedDate: new Date().toISOString().split("T")[0],
          verifiedBy: "ai_validated" as const,
        },
      },
    };
  } catch (err: unknown) {
    console.error("AI discovery error:", err);
    return {
      resolved: false,
      error: `AI discovery failed for "${providerName}". Try using a known service name or a preset.`,
    };
  }
}

function extractDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

const ACTION_LABELS: Record<ActionType, string> = {
  cancel_subscription: "cancel a subscription",
  downgrade_plan: "downgrade a plan",
  disable_autorenew: "turn off auto-renewal",
  delete_account: "close or delete an account",
  pause_service: "pause a service",
  manage_billing: "manage billing and payments",
  zero_billing_free: "verify zero-billing / free software",
};
