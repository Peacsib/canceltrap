import { SubscriptionDefusalResponse } from "@/lib/types";

export interface PresetScenario {
  id: string;
  name: string;
  badge: string;
  data: SubscriptionDefusalResponse;
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "lovable",
    name: "Lovable Pro $20/mo",
    badge: "Downgrade Maze",
    data: {
      isSubscription: true,
      merchant: {
        name: "Lovable (GPT Engineer)",
        category: "AI Code Builder",
        directPortalUrl: "https://lovable.dev/settings/billing",
        finePrintNotes: "Cancel before cycle cutoff; active compute credits expire at billing date.",
      },
      billing: {
        amount: 20.0,
        currency: "$",
        billingCycle: "monthly",
        renewalDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        daysUntilRenewal: 4,
        vampireBleed5Year: 1200.0,
      },
      darkPattern: {
        detected: true,
        patternType: "Hidden Manage Pill & Disguised Downgrade Trap",
        severity: "warning",
        summary: "Lovable hides the cancel flow behind a tiny '[Manage]' pill button next to 'Lovable Pro', and completely avoids the word 'Cancel', disguising it as 'Downgrade to free'.",
        tricksExposed: [
          "No visible 'Cancel' button anywhere on the main billing page",
          "Must click an inconspicuous '[Manage]' pill badge next to the 'Lovable Pro' title",
          "Cancellation action is disguised as 'Downgrade to free' rather than 'Cancel subscription'",
          "Decoy buttons for 'Edit billing information' and 'Invoices & payments' deflect attention",
        ],
      },
      defusalChecklist: [
        {
          stepNumber: 1,
          instruction: "On the billing page (lovable.dev/settings/billing), locate the 'Lovable Pro' card and click the small dark '[Manage]' pill button next to the title.",
          decoyWarning: "Do not search for a 'Cancel' link on the main page — it does not exist there.",
        },
        {
          stepNumber: 2,
          instruction: "In the 'Manage plan' popup modal, ignore the prominent 'Upgrade plan' button and bottom billing links.",
          decoyWarning: "Avoid clicking 'Invoices & payments' or 'Edit billing' which redirect to Stripe.",
        },
        {
          stepNumber: 3,
          instruction: "Click 'Downgrade to free' inside the modal to officially stop recurring billing.",
          decoyWarning: "Lovable never uses the word 'Cancel' — 'Downgrade to free' is their official cancellation trigger.",
        },
      ],
      killSwitch: {
        eventTitle: "🚨 Kill-Switch: Cancel Lovable Pro Subscription",
        suggestedAlertDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        alertMinutesBefore: 120,
        eventDescription:
          "CancelTrap Alert: Lovable Pro renews in 48 hours ($20/mo). 5-Year Vampire Bleed: $1,200. Direct cancellation portal: https://lovable.dev/settings/billing",
      },
    },
  },
  {
    id: "adobe",
    name: "Adobe Annual Trap",
    badge: "Hidden $300 Fee",
    data: {
      isSubscription: true,
      merchant: {
        name: "Adobe Creative Cloud",
        category: "Creative Software",
        directPortalUrl: "https://account.adobe.com/plans",
        finePrintNotes: "Annual contract paid monthly incurs a 50% remaining contract penalty if cancelled after 14 days.",
      },
      billing: {
        amount: 59.99,
        currency: "$",
        billingCycle: "monthly",
        renewalDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        daysUntilRenewal: 6,
        vampireBleed5Year: 3599.4,
      },
      darkPattern: {
        detected: true,
        patternType: "Early Termination Penalty Maze",
        severity: "critical",
        summary: "Adobe advertises a monthly price while locking users into an annual commitment with an extortionate 50% early termination cancellation fee.",
        tricksExposed: [
          "Hidden 50% early termination fee shown only on final confirmation step",
          "4-page retention quiz asking why you are leaving with fake discount bribes",
          "Offer to 'Switch to Photography plan' instead of completing cancellation",
        ],
      },
      defusalChecklist: [
        {
          stepNumber: 1,
          instruction: "Sign in to account.adobe.com/plans and click 'Manage plan' under Creative Cloud.",
          decoyWarning: "Do not choose 'Edit billing info' or 'Change plan'.",
        },
        {
          stepNumber: 2,
          instruction: "Select 'Cancel your plan' and click through the 3 retention discount screens.",
          decoyWarning: "Decline the '2 Months Free' offer — it resets your annual contract cycle!",
        },
        {
          stepNumber: 3,
          instruction: "If prompted with an Early Termination Fee, switch to a cheaper plan first (which grants a new 14-day zero-fee cancellation window), then cancel immediately.",
          decoyWarning: "Review final screen to verify $0 penalty before clicking 'Confirm'.",
        },
      ],
      killSwitch: {
        eventTitle: "🚨 Kill-Switch: Cancel Adobe Creative Cloud",
        suggestedAlertDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        alertMinutesBefore: 120,
        eventDescription:
          "CancelTrap Alert: Adobe Creative Cloud auto-renews soon ($59.99/mo). 5-Year Vampire Bleed: $3,599.40. Defusal portal: https://account.adobe.com/plans",
      },
    },
  },
  {
    id: "trial",
    name: "7-Day AI Free Trial",
    badge: "72h Countdown",
    data: {
      isSubscription: true,
      merchant: {
        name: "PromptGen AI Studio",
        category: "Generative AI Platform",
        directPortalUrl: "https://platform.example.com/billing",
        finePrintNotes: "Trial converts automatically to $39.99/mo unless cancelled at least 24h prior.",
      },
      billing: {
        amount: 39.99,
        currency: "$",
        billingCycle: "trial",
        renewalDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        daysUntilRenewal: 3,
        vampireBleed5Year: 2399.4,
      },
      darkPattern: {
        detected: true,
        patternType: "Stealth Trial Conversion Trap",
        severity: "critical",
        summary: "Zero renewal warning emails will be sent before the $39.99 monthly charge hits your card.",
        tricksExposed: [
          "No pre-charge reminder notification provided",
          "Cancel button placed in nested settings sub-menu labeled 'Team Members'",
          "Immediate loss of trial tokens threatened upon clicking cancel",
        ],
      },
      defusalChecklist: [
        {
          stepNumber: 1,
          instruction: "Navigate directly to the billing portal via the button below.",
          decoyWarning: "Avoid clicking 'Upgrade to Pro Yearly' banner.",
        },
        {
          stepNumber: 2,
          instruction: "Under 'Subscription Status', click the small text link 'Cancel trial'.",
          decoyWarning: "Ignore the alert warning 'You will lose your 50 remaining trial credits'.",
        },
        {
          stepNumber: 3,
          instruction: "Confirm cancellation and save the cancellation confirmation ID.",
        },
      ],
      killSwitch: {
        eventTitle: "🚨 Kill-Switch: Defuse 7-Day AI Free Trial",
        suggestedAlertDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        alertMinutesBefore: 120,
        eventDescription:
          "CancelTrap Alert: 7-Day AI Trial converts to $39.99/mo in 24h! Cancel now to avoid $2,399.40 5-year vampire bleed.",
      },
    },
  },
];
