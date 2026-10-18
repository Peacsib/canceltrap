export interface SubscriptionDefusalResponse {
  isSubscription: boolean;
  unrecognizedReason?: string;
  merchant: {
    name: string;
    category: string;
    directPortalUrl: string;
    finePrintNotes?: string;
  };
  billing: {
    amount: number;
    currency: string;
    billingCycle: "monthly" | "annual" | "weekly" | "trial";
    renewalDate: string;
    daysUntilRenewal: number;
    vampireBleed5Year: number;
  };
  darkPattern: {
    detected: boolean;
    patternType: string;
    severity: "critical" | "warning" | "info";
    summary: string;
    tricksExposed: string[];
  };
  defusalChecklist: {
    stepNumber: number;
    instruction: string;
    decoyWarning?: string;
  }[];
  killSwitch: {
    eventTitle: string;
    suggestedAlertDate: string;
    alertMinutesBefore: number;
    eventDescription: string;
  };
}
