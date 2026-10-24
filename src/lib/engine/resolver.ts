// ─────────────────────────────────────────────────────────────────────────────
// CancelTrap Destination-Resolution Engine — Resolver
//
// The core 6-stage resolution pipeline:
//   1. Intent parsing (handled by intent.ts)
//   2. Registry lookup (deterministic, sub-ms)
//   3. Discovery (for unknown services, deferred to AI)
//   4. Candidate ranking (multi-factor scoring)
//   5. AI validation (Gemini structured gate)
//   6. Navigation output
// ─────────────────────────────────────────────────────────────────────────────

import {
  UserIntent,
  DestinationNode,
  ResolutionResult,
  ActionType,
  NavigationStep,
} from "./types";
import { DESTINATION_REGISTRY } from "./registry";
import { parseIntent } from "./intent";

// ── Stage 2: Registry Lookup ────────────────────────────────────────────────

interface RegistryMatch {
  entry: (typeof DESTINATION_REGISTRY)[number];
  action: (typeof DESTINATION_REGISTRY)[number]["supportedActions"][number];
  score: number;
}

/**
 * Search the verified destination registry for a matching provider+action.
 * Returns all matching candidates scored by relevance.
 */
function searchRegistry(intent: UserIntent): RegistryMatch[] {
  const candidates: RegistryMatch[] = [];
  const providerLower = intent.provider.name.toLowerCase();
  const domainLower = intent.provider.domain.toLowerCase();

  for (const entry of DESTINATION_REGISTRY) {
    // Score provider match
    let providerScore = 0;

    // Exact domain match is strongest
    if (entry.providerDomain.toLowerCase() === domainLower) {
      providerScore = 1.0;
    }
    // Exact name match
    else if (entry.providerName.toLowerCase() === providerLower) {
      providerScore = 0.95;
    }
    // Alias match
    else if (
      entry.aliases.some(
        (a) =>
          a.toLowerCase() === providerLower ||
          providerLower.includes(a.toLowerCase()) ||
          a.toLowerCase().includes(providerLower)
      )
    ) {
      providerScore = 0.85;
    }
    // Domain partial match
    else if (
      domainLower.includes(entry.providerDomain.toLowerCase()) ||
      entry.providerDomain.toLowerCase().includes(domainLower)
    ) {
      providerScore = 0.75;
    }

    if (providerScore === 0) continue;

    // Find matching actions
    for (const action of entry.supportedActions) {
      let actionScore = 0;

      if (action.actionType === intent.actionType) {
        actionScore = 1.0;
      }
      // Zero-billing / free software entries match any cancellation or billing query
      else if (action.actionType === "zero_billing_free" || entry.isFreeService) {
        actionScore = 0.95;
      }
      // Treat cancel and downgrade as closely related
      else if (
        (intent.actionType === "cancel_subscription" &&
          action.actionType === "downgrade_plan") ||
        (intent.actionType === "downgrade_plan" &&
          action.actionType === "cancel_subscription")
      ) {
        actionScore = 0.7;
      }
      // manage_billing is a weak fallback match for anything
      else if (
        intent.actionType === "manage_billing" ||
        action.actionType === "manage_billing"
      ) {
        actionScore = 0.4;
      }

      if (actionScore === 0) continue;

      // Combined score: weighted average
      const combinedScore = providerScore * 0.6 + actionScore * 0.4;

      candidates.push({
        entry,
        action,
        score: combinedScore,
      });
    }
  }

  // Sort by score descending
  return candidates.sort((a, b) => b.score - a.score);
}

// ── Stage 4: Build DestinationNode from registry match ──────────────────────

function buildDestinationFromRegistry(
  match: RegistryMatch,
  intent: UserIntent
): DestinationNode {
  return {
    id: `${match.entry.id}-${match.action.actionType}`,
    providerName: match.entry.providerName,
    providerDomain: match.entry.providerDomain,
    product: intent.product,
    actionType: match.action.actionType,
    targetUrl: match.action.targetUrl,
    requiresAuth: match.action.requiresAuth,
    isModalOrInPage: match.action.isModalOrInPage,
    isFreeService:
      match.action.actionType === "zero_billing_free" ||
      Boolean(match.entry.isFreeService),
    navigationPath: match.action.navigationPath,
    darkPatternWarnings: match.action.darkPatternWarnings,
    verification: {
      status: match.score >= 0.8 ? "VERIFIED" : "PROBABLE",
      confidenceScore: match.score,
      evidenceSummary: `Matched from verified registry entry "${match.entry.providerName}" (${match.entry.category}). Last verified: ${match.action.lastVerifiedDate}.`,
      lastVerifiedDate: match.action.lastVerifiedDate,
      verifiedBy: "registry",
    },
  };
}

// ── Stage 2+3+4: Combined resolution with multi-action handling ─────────────

/**
 * Check if a provider has multiple relevant actions and needs clarification.
 */
function checkNeedsClarification(
  intent: UserIntent
): ResolutionResult["clarificationNeeded"] | null {
  // Only trigger clarification when the action is very generic
  if (
    intent.actionType !== "manage_billing" &&
    intent.actionType !== "cancel_subscription"
  )
    return null;

  const providerLower = intent.provider.name.toLowerCase();
  const domainLower = intent.provider.domain.toLowerCase();

  for (const entry of DESTINATION_REGISTRY) {
    const isMatch =
      entry.providerDomain.toLowerCase() === domainLower ||
      entry.providerName.toLowerCase() === providerLower ||
      entry.aliases.some((a) => a.toLowerCase() === providerLower);

    if (!isMatch) continue;

    // Only suggest clarification for providers with MULTIPLE distinct actions
    // AND when the user didn't specify a clear action
    if (
      entry.supportedActions.length > 1 &&
      intent.actionType === "manage_billing"
    ) {
      return {
        message: `${entry.providerName} supports multiple actions. Which one do you need?`,
        options: entry.supportedActions.map((a) => ({
          label: formatActionLabel(a.actionType, entry.providerName),
          actionType: a.actionType,
        })),
      };
    }

    // For multi-product cloud providers like AWS where closing the entire root account
    // is completely different from cancelling a marketplace SaaS subscription:
    const hasAccountClosure = entry.supportedActions.some(
      (a) => a.actionType === "delete_account"
    );
    if (
      hasAccountClosure &&
      entry.supportedActions.length > 1 &&
      !intent.product &&
      intent.actionType === "cancel_subscription" &&
      (entry.id === "aws" || entry.id === "gcp")
    ) {
      return {
        message: `${entry.providerName} has multiple scopes. Do you want to cancel a specific subscription or close your account?`,
        options: entry.supportedActions.map((a) => ({
          label: formatActionLabel(a.actionType, entry.providerName),
          actionType: a.actionType,
        })),
      };
    }
  }

  return null;
}

function formatActionLabel(actionType: ActionType, providerName: string): string {
  const labels: Record<ActionType, string> = {
    cancel_subscription: `Cancel ${providerName} subscription`,
    downgrade_plan: `Downgrade ${providerName} plan`,
    disable_autorenew: `Turn off auto-renewal`,
    delete_account: `Close / delete ${providerName} account`,
    pause_service: `Pause ${providerName} service`,
    manage_billing: `Manage billing & payments`,
    zero_billing_free: `Verify ${providerName} is free software`,
  };
  return labels[actionType] || actionType;
}

// ── Public API: Resolve ─────────────────────────────────────────────────────

/**
 * The main resolution function.
 *
 * Takes a raw user query and returns either:
 *  - A verified destination with navigation steps
 *  - A clarification request (for ambiguous multi-product providers)
 *  - A null destination (for unknown providers, to be resolved by AI)
 */
export function resolve(rawQuery: string): ResolutionResult {
  // Stage 1: Parse intent
  const intent = parseIntent(rawQuery);

  if (!intent) {
    return {
      resolved: false,
      error:
        "Could not identify a service provider. Try searching by name (e.g., 'Adobe cancel subscription') or paste a URL.",
    };
  }

  // Stage 2: Check if clarification is needed (multi-action providers)
  const clarification = checkNeedsClarification(intent);
  if (clarification) {
    return {
      resolved: false,
      clarificationNeeded: clarification,
    };
  }

  // Stage 3: Search registry
  const matches = searchRegistry(intent);

  if (matches.length > 0) {
    const best = matches[0];
    const destination = buildDestinationFromRegistry(best, intent);

    return {
      resolved: true,
      destination,
    };
  }

  // Stage 4: No registry hit — return unresolved for AI discovery
  return {
    resolved: false,
    destination: {
      id: `unknown-${intent.provider.domain}`,
      providerName: intent.provider.name,
      providerDomain: intent.provider.domain,
      actionType: intent.actionType,
      targetUrl: "",
      requiresAuth: true,
      isModalOrInPage: false,
      navigationPath: [],
      darkPatternWarnings: [],
      verification: {
        status: "UNRESOLVED",
        confidenceScore: 0,
        evidenceSummary: `"${intent.provider.name}" is not in the verified registry. AI discovery will attempt to find the destination.`,
        lastVerifiedDate: new Date().toISOString().split("T")[0],
        verifiedBy: "algorithmic_discovery",
      },
    },
  };
}

/**
 * Resolve with a specific action (used after clarification).
 */
export function resolveWithAction(
  rawQuery: string,
  actionType: ActionType
): ResolutionResult {
  const intent = parseIntent(rawQuery);
  if (!intent) {
    return {
      resolved: false,
      error: "Could not identify a service provider.",
    };
  }

  // Override action type
  intent.actionType = actionType;

  const matches = searchRegistry(intent);
  if (matches.length > 0) {
    return {
      resolved: true,
      destination: buildDestinationFromRegistry(matches[0], intent),
    };
  }

  return {
    resolved: false,
    error: `No verified destination found for "${intent.provider.name}" with action "${actionType}".`,
  };
}

/** Export parseIntent for use by the API route */
export { parseIntent };
