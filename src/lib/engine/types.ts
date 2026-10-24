// ─────────────────────────────────────────────────────────────────────────────
// CancelTrap Destination-Resolution Engine — Core Types
// ─────────────────────────────────────────────────────────────────────────────

/** Supported user actions that CancelTrap can resolve destinations for. */
export type ActionType =
  | "cancel_subscription"
  | "downgrade_plan"
  | "disable_autorenew"
  | "delete_account"
  | "pause_service"
  | "manage_billing"
  | "zero_billing_free";

/** The normalized intent extracted from user input (search query or pasted URL). */
export interface UserIntent {
  rawQuery: string;
  provider: {
    name: string;
    domain: string;
    aliases: string[];
  };
  product?: string;
  actionType: ActionType;
  startingUrl?: string;
}

/** A single step in a multi-step navigation path. */
export interface NavigationStep {
  stepNumber: number;
  label: string;
  instruction: string;
  targetType: "link" | "button" | "modal_trigger" | "dropdown" | "tab";
  decoyWarning?: string;
}

/** Verification status of a resolved destination. */
export type VerificationStatus =
  | "VERIFIED"
  | "PROBABLE"
  | "GUIDED_PATH"
  | "NEEDS_CLARIFICATION"
  | "UNRESOLVED";

/** A resolved destination node — the core output of the engine. */
export interface DestinationNode {
  id: string;
  providerName: string;
  providerDomain: string;
  product?: string;
  actionType: ActionType;
  targetUrl: string;
  requiresAuth: boolean;
  isModalOrInPage: boolean;
  isFreeService?: boolean;
  navigationPath: NavigationStep[];
  darkPatternWarnings: string[];
  verification: {
    status: VerificationStatus;
    confidenceScore: number;
    evidenceSummary: string;
    lastVerifiedDate: string;
    verifiedBy:
      | "registry"
      | "algorithmic_discovery"
      | "ai_validated"
      | "brave_search_verified"
      | "brave_search_grounded";
  };
}

/** A registry entry — stored knowledge about a provider's action destinations. */
export interface RegistryEntry {
  id: string;
  providerName: string;
  providerDomain: string;
  aliases: string[];
  products?: string[];
  category: string;
  isFreeService?: boolean;
  supportedActions: {
    actionType: ActionType;
    targetUrl: string;
    requiresAuth: boolean;
    isModalOrInPage: boolean;
    navigationPath: NavigationStep[];
    darkPatternWarnings: string[];
    finePrintNotes?: string;
    lastVerifiedDate: string;
  }[];
}

/** AI validation request sent to Gemini for destination verification. */
export interface AIValidationRequest {
  userQuery: string;
  candidateUrl: string;
  providerName: string;
  actionType: ActionType;
  evidenceSnippets: string[];
}

/** Structured AI validation response. */
export interface AIValidationVerdict {
  isMatch: boolean;
  confidence: number;
  isTerminalActionPage: boolean;
  verifiedDestinationUrl?: string;
  navigationPath?: {
    stepNumber: number;
    instruction: string;
    decoyWarning?: string;
  }[];
  darkPatternWarnings: string[];
  missingPrerequisites: string[];
  userGuidance: string;
}

/** The full resolution result returned to the client. */
export interface ResolutionResult {
  resolved: boolean;
  destination?: DestinationNode;
  clarificationNeeded?: {
    message: string;
    options: { label: string; actionType: ActionType; product?: string }[];
  };
  error?: string;
}
