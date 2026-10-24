// ─────────────────────────────────────────────────────────────────────────────
// CancelTrap Destination-Resolution Engine — Intent Parser
//
// Extracts structured intent from raw user input:
//   - Search query:  "adobe cancel subscription"
//   - Pasted URL:    "https://account.adobe.com/plans"
//   - Combination:   "lovable.dev — downgrade"
// ─────────────────────────────────────────────────────────────────────────────

import { ActionType, UserIntent } from "./types";
import { DESTINATION_REGISTRY } from "./registry";

// ── Action keyword map ──────────────────────────────────────────────────────
// Maps natural-language synonyms to canonical action types.
const ACTION_KEYWORDS: Record<string, ActionType> = {
  // cancel
  cancel: "cancel_subscription",
  "cancel subscription": "cancel_subscription",
  "stop subscription": "cancel_subscription",
  "end subscription": "cancel_subscription",
  unsubscribe: "cancel_subscription",
  "stop charging": "cancel_subscription",
  "stop payments": "cancel_subscription",
  "stop paying": "cancel_subscription",
  "remove subscription": "cancel_subscription",
  terminate: "cancel_subscription",
  "opt out": "cancel_subscription",

  // downgrade
  downgrade: "downgrade_plan",
  "downgrade plan": "downgrade_plan",
  "switch to free": "downgrade_plan",
  "go free": "downgrade_plan",
  "free tier": "downgrade_plan",
  "free plan": "downgrade_plan",

  // auto-renew
  "turn off auto-renew": "disable_autorenew",
  "disable auto-renew": "disable_autorenew",
  "stop auto-renew": "disable_autorenew",
  "turn off renewal": "disable_autorenew",
  "disable renewal": "disable_autorenew",
  autorenew: "disable_autorenew",
  "auto renew": "disable_autorenew",
  "recurring billing": "disable_autorenew",

  // delete account
  "delete account": "delete_account",
  "close account": "delete_account",
  "remove account": "delete_account",
  "deactivate account": "delete_account",

  // pause
  pause: "pause_service",
  "pause subscription": "pause_service",
  "pause service": "pause_service",
  freeze: "pause_service",

  // manage billing (fallback)
  billing: "manage_billing",
  "manage billing": "manage_billing",
  manage: "manage_billing",
  settings: "manage_billing",
};

// Sorted longest-first so "cancel subscription" matches before "cancel"
const SORTED_ACTION_KEYS = Object.keys(ACTION_KEYWORDS).sort(
  (a, b) => b.length - a.length
);

/** Extracts a URL from the raw query if one is present. */
function extractUrl(query: string): string | undefined {
  const urlMatch = query.match(
    /https?:\/\/[^\s,]+|(?:[a-z0-9-]+\.)+(?:com|dev|io|org|net|co|ai|app|cloud|me)(?:\/[^\s,]*)?/i
  );
  if (!urlMatch) return undefined;
  let url = urlMatch[0];
  if (!url.startsWith("http")) {
    url = "https://" + url;
  }
  return url;
}

/** Attempts to extract a domain from a URL or known alias. */
function extractDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^www\./, "").split("/")[0];
  }
}

/** Match a provider from user text against the registry. */
function matchProvider(text: string): {
  name: string;
  domain: string;
  aliases: string[];
} | null {
  const lower = text.toLowerCase();

  for (const entry of DESTINATION_REGISTRY) {
    // Check aliases (sorted longest-first for precision)
    const allNames = [
      entry.providerName.toLowerCase(),
      entry.providerDomain.toLowerCase(),
      ...entry.aliases.map((a) => a.toLowerCase()),
    ].sort((a, b) => b.length - a.length);

    for (const alias of allNames) {
      if (lower.includes(alias)) {
        return {
          name: entry.providerName,
          domain: entry.providerDomain,
          aliases: entry.aliases,
        };
      }
    }
  }

  return null;
}

/** Match provider by domain (for pasted URLs). */
function matchProviderByDomain(domain: string): {
  name: string;
  domain: string;
  aliases: string[];
} | null {
  const lowerDomain = domain.toLowerCase();

  for (const entry of DESTINATION_REGISTRY) {
    if (
      lowerDomain.includes(entry.providerDomain.toLowerCase()) ||
      entry.providerDomain.toLowerCase().includes(lowerDomain)
    ) {
      return {
        name: entry.providerName,
        domain: entry.providerDomain,
        aliases: entry.aliases,
      };
    }
  }

  return null;
}

/** Detect the action type from the raw query. */
function detectAction(text: string): ActionType {
  const lower = text.toLowerCase();

  for (const key of SORTED_ACTION_KEYS) {
    if (lower.includes(key)) {
      return ACTION_KEYWORDS[key];
    }
  }

  // Default: if no explicit action keyword found, assume cancel
  return "cancel_subscription";
}

/** Detect product from the query (optional refinement). */
function detectProduct(text: string, providerName: string): string | undefined {
  const lower = text.toLowerCase();
  const providerLower = providerName.toLowerCase();

  // Find the registry entry for the provider
  const entry = DESTINATION_REGISTRY.find(
    (e) => e.providerName.toLowerCase() === providerLower
  );

  if (entry?.products) {
    for (const product of entry.products) {
      if (lower.includes(product.toLowerCase())) {
        return product;
      }
    }
  }

  return undefined;
}

/**
 * Parse raw user input into a structured UserIntent.
 *
 * Handles:
 *   - "adobe cancel subscription"
 *   - "https://lovable.dev/settings/billing"
 *   - "google cloud — close billing account"
 *   - "spotify"
 */
export function parseIntent(rawQuery: string): UserIntent | null {
  const trimmed = rawQuery.trim();
  if (!trimmed) return null;

  // 1. Extract URL if present
  const startingUrl = extractUrl(trimmed);

  // 2. Try to match provider — first by URL domain, then by text
  let provider: { name: string; domain: string; aliases: string[] } | null =
    null;

  if (startingUrl) {
    const domain = extractDomainFromUrl(startingUrl);
    provider = matchProviderByDomain(domain);
  }

  if (!provider) {
    provider = matchProvider(trimmed);
  }

  // If we still can't identify the provider, try to extract a service name
  // from the query for AI-based resolution
  if (!provider) {
    // Clean the query of action words to isolate the provider name
    let serviceName = trimmed;
    for (const key of SORTED_ACTION_KEYS) {
      serviceName = serviceName.replace(new RegExp(key, "gi"), "").trim();
    }
    // Remove common connectors
    serviceName = serviceName
      .replace(/^[-—–:,.\s]+|[-—–:,.\s]+$/g, "")
      .trim();

    if (serviceName.length > 0) {
      const domain = serviceName.toLowerCase().replace(/\s+/g, "") + ".com";
      provider = {
        name: serviceName,
        domain,
        aliases: [serviceName.toLowerCase()],
      };
    }
  }

  if (!provider) return null;

  // 3. Detect action type
  const actionType = detectAction(trimmed);

  // 4. Detect product (optional)
  const product = detectProduct(trimmed, provider.name);

  return {
    rawQuery: trimmed,
    provider,
    product,
    actionType,
    startingUrl,
  };
}
