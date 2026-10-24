// ─────────────────────────────────────────────────────────────────────────────
// CancelTrap Destination-Resolution Engine — Verified Route Registry
//
// This is a curated, structured database of known service cancellation /
// management destinations. Each entry contains verified URLs, navigation
// paths, dark pattern warnings, and action metadata.
//
// The registry is the FIRST source the engine queries. A hit here skips
// costly discovery and AI validation entirely.
// ─────────────────────────────────────────────────────────────────────────────

import { RegistryEntry } from "./types";

export const DESTINATION_REGISTRY: RegistryEntry[] = [
  // ──────────────────────────────────────────────────────────────────────
  // ecoAI Tokens (Econet Wireless Zimbabwe / Cassava AI)
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "ecoai",
    providerName: "ecoAI Tokens (Econet Zimbabwe)",
    providerDomain: "ecoaitoken.co.zw",
    aliases: [
      "ecoai",
      "eco ai",
      "ecoai tokens",
      "econet ai",
      "cassava ai",
      "econet ecoai",
      "ecochat",
      "econet zimbabwe",
      "*449#",
      "449",
    ],
    products: ["EcoAI Multi-Model Tokens", "EcoChat AI", "Daily AI Pass"],
    category: "AI Platform & Mobile VAS",
    supportedActions: [
      {
        actionType: "cancel_subscription",
        targetUrl: "https://ecoaitoken.co.zw",
        requiresAuth: true,
        isModalOrInPage: true,
        navigationPath: [
          {
            stepNumber: 1,
            label: "USSD Mobile Defusal (*449#)",
            instruction: "On your Econet Zimbabwe mobile device, dial *449# to open the EcoAI/EcoChat interactive USSD menu. Alternatively, send an SMS with the keyword 'STOP' to shortcode 449.",
            targetType: "button",
            decoyWarning: "Do not simply stop using the service; recurring daily or weekly bundle deductions will quietly consume airtime/EcoCash balance via VAS billing.",
          },
          {
            stepNumber: 2,
            label: "Select Subscription Management",
            instruction: "In the *449# USSD menu, reply with the menu number for 'My Account' or 'Subscriptions', then select 'Opt Out of Recurring Tokens' or 'Deactivate Service'.",
            targetType: "button",
            decoyWarning: "Do not choose 'Balance Enquiry' or 'Buy More Tokens' — look specifically for Deactivate or Opt-Out.",
          },
          {
            stepNumber: 3,
            label: "Web Portal or Yamurai WhatsApp Confirmation",
            instruction: "If using the web platform at ecoaitoken.co.zw, log in with your Econet number, go to Account Profile -> Active Passes, and toggle auto-recharge to Off. You can also message Econet's official Yamurai Assistant on WhatsApp at +263 781 222 000.",
            targetType: "link",
            decoyWarning: "Ensure you receive an official confirmation SMS confirming VAS cancellation before your next airtime top-up.",
          },
        ],
        darkPatternWarnings: [
          "Silent airtime & EcoCash wallet auto-renewal via mobile VAS recurring billing",
          "USSD cancellation options often grouped under general Vas/Account submenus",
          "Tokens expire at cutoff even if unused without refund",
        ],
        finePrintNotes: "Dial *449# or SMS 'STOP' to 449 on any Econet line. Web portal: https://ecoaitoken.co.zw. Support: 111.",
        lastVerifiedDate: "2026-10-24",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // Ngaatec (Ngaatec Private Limited — Zimbabwe Web Hosting & Domains)
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "ngaatec",
    providerName: "Ngaatec",
    providerDomain: "ngaatec.co.zw",
    aliases: [
      "ngaatec",
      "ngaatec web hosting",
      "ngaatec hosting",
      "ngaatec domains",
      "ngaatec private limited",
      "ngaatec.co.zw",
      "ngaatec.com",
    ],
    products: ["Web Hosting", "Domain Registration", "cPanel Services", "SSL Certificates"],
    category: "Web Hosting & Cloud Services",
    supportedActions: [
      {
        actionType: "cancel_subscription",
        targetUrl: "https://www.ngaatec.co.zw",
        requiresAuth: true,
        isModalOrInPage: true,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Open Ngaatec Client Portal",
            instruction: "Navigate to ngaatec.co.zw and log in to the Client Area using your registered account credentials.",
            targetType: "link",
            decoyWarning: "Ensure you are signed in to the primary account linked to your domain and hosting billing.",
          },
          {
            stepNumber: 2,
            label: "Navigate to Services & Subscriptions",
            instruction: "From the Client Area dashboard, click 'Services' -> 'My Services'. Locate the active hosting package or domain you wish to cancel and click 'Manage'.",
            targetType: "button",
            decoyWarning: "Do not select 'Invoices' or 'Upgrade' — open the specific active service details panel.",
          },
          {
            stepNumber: 3,
            label: "Request Service Cancellation",
            instruction: "In the Actions sidebar, select 'Request Cancellation'. Choose between 'Immediate' or 'End of Billing Period', enter a brief cancellation reason, and confirm.",
            targetType: "button",
            decoyWarning: "If paid via EcoCash or automated bank standing order, ensure any recurring merchant authorization is revoked.",
          },
        ],
        darkPatternWarnings: [
          "Domain renewal notices sent automatically prior to hosting cycle expiry",
          "Cancellation requests require formal confirmation via the WHMCS Client Area",
          "Automated mobile money or EcoCash recurring billing standing orders must be canceled directly",
        ],
        finePrintNotes: "Cancel via Client Area before invoice generation cycle. Support: info@ngaatec.com / WhatsApp support.",
        lastVerifiedDate: "2026-10-24",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // NetOne Cellular (Zimbabwe Mobile Network & Value Added Services)
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "netone",
    providerName: "NetOne Cellular (Zimbabwe)",
    providerDomain: "netone.co.zw",
    aliases: [
      "netone",
      "net one",
      "netone cellular",
      "netone zimbabwe",
      "one fusion",
      "onefusion",
      "onemoney",
      "one money",
      "*111#",
      "*130#",
      "netone.co.zw",
      "www.netone.co.zw",
    ],
    products: ["OneFusion Bundles", "Data & Voice Passes", "Value Added Services", "OneMoney Subscriptions"],
    category: "Mobile Telecommunications & VAS",
    supportedActions: [
      {
        actionType: "cancel_subscription",
        targetUrl: "https://www.netone.co.zw",
        requiresAuth: true,
        isModalOrInPage: true,
        navigationPath: [
          {
            stepNumber: 1,
            label: "USSD Defusal Dial (*111# or *130#)",
            instruction: "On your NetOne mobile handset, dial *111# to launch the official NetOne Customer Self-Service USSD portal. If your subscription is billed via mobile money, dial *130# for OneMoney.",
            targetType: "button",
            decoyWarning: "Do not rely on simply depleting airtime; recurring bundles deduct automatically from any subsequent airtime or OneMoney top-up.",
          },
          {
            stepNumber: 2,
            label: "Select Subscriptions & Active Bundles",
            instruction: "In the *111# USSD menu, reply with the number for 'Active Bundles / Subscriptions' or 'Manage Services'. Select 'Cancel Auto-Renewal' or 'Deactivate Service'.",
            targetType: "button",
            decoyWarning: "Do not select 'Buy Bundles' or 'Check Balance' — look specifically for Manage or Opt-Out options.",
          },
          {
            stepNumber: 3,
            label: "Official Portal & Care Confirmation",
            instruction: "Visit the verified NetOne portal at https://www.netone.co.zw or contact NetOne Customer Care by dialing 123 (toll-free on NetOne) or WhatsApp +263 712 980 198 to confirm deactivation.",
            targetType: "link",
            decoyWarning: "Ensure you receive an official carrier SMS confirming service deactivation to prevent unexpected future airtime deductions.",
          },
        ],
        darkPatternWarnings: [
          "Silent airtime drain: Auto-renewing bundles deduct immediately from newly loaded airtime or OneMoney balances",
          "Speculative subdomains: Portals like 'selfcare.netone.co.zw' do not exist on public DNS; all management is strictly via USSD (*111#) or official www.netone.co.zw",
          "Buried opt-out options in multi-layered USSD carrier submenus",
        ],
        finePrintNotes: "Dial *111# on your NetOne phone or visit https://www.netone.co.zw. NetOne Customer Care WhatsApp: +263 712 980 198, Toll-Free: 123.",
        lastVerifiedDate: "2026-10-24",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // Lovable (GPT Engineer)
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "lovable",
    providerName: "Lovable",
    providerDomain: "lovable.dev",
    aliases: ["lovable", "gpt engineer", "gptengineer"],
    products: ["Pro", "Teams"],
    category: "AI Code Builder",
    supportedActions: [
      {
        actionType: "cancel_subscription",
        targetUrl: "https://lovable.dev/settings/billing",
        requiresAuth: true,
        isModalOrInPage: true,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Open Billing",
            instruction: "Go to lovable.dev/settings/billing. Look for the 'Lovable Pro' card at the top of the page.",
            targetType: "link",
            decoyWarning: "Do not search for a 'Cancel' link on the main page — it does not exist.",
          },
          {
            stepNumber: 2,
            label: "Click Manage pill",
            instruction: "Click the small dark '[Manage]' pill button right next to the 'Lovable Pro' title text.",
            targetType: "button",
            decoyWarning: "This pill is easy to miss. It is NOT labeled 'Cancel' — it says 'Manage'.",
          },
          {
            stepNumber: 3,
            label: "Downgrade to free",
            instruction: "In the 'Manage plan' popup modal, click 'Downgrade to free' to cancel your subscription.",
            targetType: "modal_trigger",
            decoyWarning: "Ignore 'Upgrade plan', 'Edit billing information', and 'Invoices & payments' — they will not cancel anything.",
          },
        ],
        darkPatternWarnings: [
          "No visible 'Cancel' button anywhere on the billing page",
          "Cancellation hidden behind tiny '[Manage]' pill badge",
          "Action disguised as 'Downgrade to free' instead of 'Cancel subscription'",
          "Decoy buttons ('Edit billing', 'Invoices') deflect to Stripe",
        ],
        finePrintNotes: "Cancel before cycle cutoff; active compute credits expire at billing date.",
        lastVerifiedDate: "2026-10-22",
      },
      {
        actionType: "downgrade_plan",
        targetUrl: "https://lovable.dev/settings/billing",
        requiresAuth: true,
        isModalOrInPage: true,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Open Billing",
            instruction: "Navigate to lovable.dev/settings/billing.",
            targetType: "link",
          },
          {
            stepNumber: 2,
            label: "Click Manage",
            instruction: "Click the '[Manage]' pill button next to your current plan name.",
            targetType: "button",
          },
          {
            stepNumber: 3,
            label: "Select Downgrade",
            instruction: "Choose 'Downgrade to free' in the manage plan dialog.",
            targetType: "modal_trigger",
          },
        ],
        darkPatternWarnings: [
          "Downgrade and cancel use the same hidden 'Manage' pill button",
        ],
        lastVerifiedDate: "2026-10-22",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // Adobe Creative Cloud
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "adobe",
    providerName: "Adobe Creative Cloud",
    providerDomain: "adobe.com",
    aliases: ["adobe", "adobe cc", "creative cloud", "photoshop", "illustrator", "premiere pro", "lightroom", "acrobat"],
    products: ["Creative Cloud All Apps", "Photography Plan", "Single App", "Acrobat Pro"],
    category: "Creative Software",
    supportedActions: [
      {
        actionType: "cancel_subscription",
        targetUrl: "https://account.adobe.com/plans",
        requiresAuth: true,
        isModalOrInPage: false,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Open Plans",
            instruction: "Sign in to account.adobe.com/plans and find your active Creative Cloud plan.",
            targetType: "link",
            decoyWarning: "Do not click 'Edit billing info' or 'Change payment method'.",
          },
          {
            stepNumber: 2,
            label: "Manage Plan",
            instruction: "Click 'Manage plan' under your Creative Cloud subscription tile.",
            targetType: "button",
            decoyWarning: "Decline the initial 'Switch plan' or 'See other plans' options.",
          },
          {
            stepNumber: 3,
            label: "Cancel Plan",
            instruction: "Select 'Cancel your plan' and click through the 3-4 retention screens.",
            targetType: "button",
            decoyWarning: "Decline '2 Months Free' and 'Pause Membership' offers — they reset your contract cycle.",
          },
          {
            stepNumber: 4,
            label: "Confirm Cancellation",
            instruction: "Review any early termination fee on the final screen. If on an annual plan paid monthly, consider switching to a cheaper plan first (creates a new 14-day fee-free cancellation window), then cancel immediately.",
            targetType: "button",
            decoyWarning: "Verify the final screen shows $0.00 penalty before clicking 'Confirm'.",
          },
        ],
        darkPatternWarnings: [
          "Hidden 50% early termination fee on annual plans paid monthly",
          "4-page retention quiz with fake discount bribes",
          "'Pause Membership' decoy resets contract rather than stopping billing",
          "Offered 'Switch to Photography plan' to keep any revenue stream",
        ],
        finePrintNotes: "Annual contract paid monthly incurs 50% remaining contract penalty if cancelled after 14 days.",
        lastVerifiedDate: "2026-10-22",
      },
      {
        actionType: "disable_autorenew",
        targetUrl: "https://account.adobe.com/plans",
        requiresAuth: true,
        isModalOrInPage: false,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Open Plans",
            instruction: "Go to account.adobe.com/plans.",
            targetType: "link",
          },
          {
            stepNumber: 2,
            label: "Manage Plan",
            instruction: "Click 'Manage plan' and look for an auto-renewal toggle or cancellation option.",
            targetType: "button",
            decoyWarning: "Adobe does not always offer a simple toggle — cancellation may be the only way to stop renewal.",
          },
        ],
        darkPatternWarnings: [
          "No standalone 'turn off auto-renew' toggle for most plans",
        ],
        lastVerifiedDate: "2026-10-22",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // Amazon Web Services (AWS)
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "aws",
    providerName: "Amazon Web Services",
    providerDomain: "aws.amazon.com",
    aliases: ["aws", "amazon web services", "amazon cloud"],
    products: ["AWS Account", "AWS Marketplace Subscription", "Savings Plans", "EC2", "RDS", "S3"],
    category: "Cloud Infrastructure",
    supportedActions: [
      {
        actionType: "cancel_subscription",
        targetUrl: "https://us-east-1.console.aws.amazon.com/marketplace/home#/subscriptions",
        requiresAuth: true,
        isModalOrInPage: false,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Open Marketplace",
            instruction: "Go to the AWS Marketplace console: console.aws.amazon.com/marketplace/home#/subscriptions.",
            targetType: "link",
            decoyWarning: "This is for marketplace SaaS subscriptions, not for closing the entire AWS account.",
          },
          {
            stepNumber: 2,
            label: "Select Subscription",
            instruction: "Find the subscription you want to cancel and click 'Manage'.",
            targetType: "button",
          },
          {
            stepNumber: 3,
            label: "Cancel",
            instruction: "Under 'Actions', select 'Cancel subscription' and confirm.",
            targetType: "button",
            decoyWarning: "Some marketplace subscriptions have minimum commitment periods.",
          },
        ],
        darkPatternWarnings: [
          "Marketplace subscriptions and AWS account closure are completely different flows",
          "Must distinguish between per-service resources, billing account, and marketplace SaaS",
        ],
        lastVerifiedDate: "2026-10-22",
      },
      {
        actionType: "delete_account",
        targetUrl: "https://us-east-1.console.aws.amazon.com/billing/home#/account",
        requiresAuth: true,
        isModalOrInPage: false,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Open Account Settings",
            instruction: "Navigate to console.aws.amazon.com/billing/home#/account as the root user.",
            targetType: "link",
            decoyWarning: "IAM users cannot close accounts — you MUST sign in as the root account owner.",
          },
          {
            stepNumber: 2,
            label: "Close Account",
            instruction: "Scroll to the bottom of the page and click 'Close Account'. Read the warnings carefully.",
            targetType: "button",
            decoyWarning: "Closing the account terminates ALL resources, including running EC2 instances, databases, and S3 buckets. Data may be unrecoverable after 90 days.",
          },
          {
            stepNumber: 3,
            label: "Confirm Closure",
            instruction: "Check the acknowledgement boxes and click 'Close Account'.",
            targetType: "button",
          },
        ],
        darkPatternWarnings: [
          "Account closure is irreversible after the 90-day grace period",
          "Must be root user — IAM admins cannot close accounts",
          "Active resources will continue to incur charges during the 90-day suspension",
        ],
        lastVerifiedDate: "2026-10-22",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // Google Cloud Platform
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "gcp",
    providerName: "Google Cloud",
    providerDomain: "cloud.google.com",
    aliases: ["google cloud", "gcp", "google cloud platform", "gcloud", "google_cloud", "gemini", "google gemini"],
    products: ["Billing Account", "Project", "Workspace", "Cloud Run", "Compute Engine"],
    category: "Cloud Infrastructure",
    supportedActions: [
      {
        actionType: "cancel_subscription",
        targetUrl: "https://console.cloud.google.com/billing",
        requiresAuth: true,
        isModalOrInPage: false,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Open Billing",
            instruction: "Navigate to console.cloud.google.com/billing and select the billing account you want to close.",
            targetType: "link",
          },
          {
            stepNumber: 2,
            label: "Account Management",
            instruction: "In the left sidebar, click 'Account Management'.",
            targetType: "link",
          },
          {
            stepNumber: 3,
            label: "Close Billing Account",
            instruction: "Click 'Close Billing Account' in the top action bar and confirm.",
            targetType: "button",
            decoyWarning: "Closing a billing account disables ALL linked projects, Cloud Run services, and Compute Engine VMs.",
          },
        ],
        darkPatternWarnings: [
          "Requires 'Billing Account Administrator' IAM role",
          "Linked projects stop serving immediately when billing is closed",
          "No standalone 'cancel subscription' button — must close billing account",
        ],
        finePrintNotes: "Closing a billing account is different from deleting a project. Outstanding charges still apply.",
        lastVerifiedDate: "2026-10-22",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // Spotify
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "spotify",
    providerName: "Spotify",
    providerDomain: "spotify.com",
    aliases: ["spotify", "spotify premium", "spotify family"],
    products: ["Premium Individual", "Premium Duo", "Premium Family", "Premium Student"],
    category: "Music Streaming",
    supportedActions: [
      {
        actionType: "cancel_subscription",
        targetUrl: "https://www.spotify.com/account/subscription/",
        requiresAuth: true,
        isModalOrInPage: false,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Open Subscription",
            instruction: "Go to spotify.com/account/subscription/. Sign in if prompted.",
            targetType: "link",
          },
          {
            stepNumber: 2,
            label: "Change Plan",
            instruction: "Click 'Change plan' under your current subscription details.",
            targetType: "button",
            decoyWarning: "Do not click 'Update' next to payment method — that only changes your card.",
          },
          {
            stepNumber: 3,
            label: "Cancel Premium",
            instruction: "Scroll down past all the alternative plan options and click 'Cancel Premium'.",
            targetType: "button",
            decoyWarning: "Spotify shows a full page of 'downgrade' plan options ABOVE the actual cancel button to distract you.",
          },
          {
            stepNumber: 4,
            label: "Confirm",
            instruction: "On the confirmation page, click 'Yes, cancel' to finalize.",
            targetType: "button",
          },
        ],
        darkPatternWarnings: [
          "Cancel button hidden below a wall of alternative plan options",
          "'Change plan' is the entry point — there is no 'Cancel' button on the main page",
          "Retention screen may offer discounts before showing the final cancel option",
        ],
        lastVerifiedDate: "2026-10-22",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // Netflix
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "netflix",
    providerName: "Netflix",
    providerDomain: "netflix.com",
    aliases: ["netflix"],
    products: ["Standard with Ads", "Standard", "Premium"],
    category: "Video Streaming",
    supportedActions: [
      {
        actionType: "cancel_subscription",
        targetUrl: "https://www.netflix.com/cancelplan",
        requiresAuth: true,
        isModalOrInPage: false,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Open Cancel Page",
            instruction: "Go directly to netflix.com/cancelplan. You may need to sign in first.",
            targetType: "link",
          },
          {
            stepNumber: 2,
            label: "Finish Cancellation",
            instruction: "Click 'Finish Cancellation' to confirm. Your access continues until the current billing period ends.",
            targetType: "button",
            decoyWarning: "Netflix shows a 'Downgrade instead?' option — only use this if you actually want a cheaper plan.",
          },
        ],
        darkPatternWarnings: [
          "'Downgrade instead' option shown prominently before the actual cancel button",
        ],
        lastVerifiedDate: "2026-10-22",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // GitHub (Copilot, Pro)
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "github",
    providerName: "GitHub",
    providerDomain: "github.com",
    aliases: ["github", "github copilot", "copilot", "github pro"],
    products: ["Pro", "Copilot Individual", "Copilot Business", "Team", "Enterprise"],
    category: "Developer Tools",
    supportedActions: [
      {
        actionType: "cancel_subscription",
        targetUrl: "https://github.com/settings/billing/summary",
        requiresAuth: true,
        isModalOrInPage: false,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Open Billing",
            instruction: "Go to github.com/settings/billing/summary and sign in.",
            targetType: "link",
          },
          {
            stepNumber: 2,
            label: "Edit Plan",
            instruction: "Under your active subscription (Pro or Copilot), click 'Edit' or 'Cancel plan'.",
            targetType: "button",
          },
          {
            stepNumber: 3,
            label: "Confirm Cancellation",
            instruction: "Follow the cancellation prompts and confirm.",
            targetType: "button",
            decoyWarning: "GitHub may show a retention offer with a discount — decline if you want to fully cancel.",
          },
        ],
        darkPatternWarnings: [
          "Different cancellation flows for personal vs organization plans",
          "Copilot Business requires org admin to cancel",
        ],
        lastVerifiedDate: "2026-10-22",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // Slack
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "slack",
    providerName: "Slack",
    providerDomain: "slack.com",
    aliases: ["slack", "slack pro", "slack business"],
    products: ["Pro", "Business+", "Enterprise Grid"],
    category: "Team Communication",
    supportedActions: [
      {
        actionType: "cancel_subscription",
        targetUrl: "https://{workspace}.slack.com/admin/billing",
        requiresAuth: true,
        isModalOrInPage: false,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Open Billing",
            instruction: "Navigate to {your-workspace}.slack.com/admin/billing. You must be a Workspace Owner or Admin.",
            targetType: "link",
            decoyWarning: "Replace '{workspace}' with your actual Slack workspace URL slug.",
          },
          {
            stepNumber: 2,
            label: "Change Plan",
            instruction: "Click 'Change plan type' or 'Manage plan'.",
            targetType: "button",
          },
          {
            stepNumber: 3,
            label: "Switch to Free",
            instruction: "Select the Free plan to downgrade. Confirm the change.",
            targetType: "button",
            decoyWarning: "Downgrading removes message history beyond 90 days and file storage limits.",
          },
        ],
        darkPatternWarnings: [
          "No 'Cancel' button — must 'downgrade to Free' instead",
          "Requires Workspace Owner role — regular members cannot access billing",
          "URL requires workspace-specific subdomain",
        ],
        lastVerifiedDate: "2026-10-22",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // Notion
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "notion",
    providerName: "Notion",
    providerDomain: "notion.so",
    aliases: ["notion", "notion pro", "notion team"],
    products: ["Plus", "Business", "Enterprise"],
    category: "Productivity",
    supportedActions: [
      {
        actionType: "cancel_subscription",
        targetUrl: "https://www.notion.so/profile",
        requiresAuth: true,
        isModalOrInPage: false,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Open Settings",
            instruction: "Go to Settings & members in the left sidebar (or notion.so/profile for personal).",
            targetType: "link",
          },
          {
            stepNumber: 2,
            label: "Plans & Billing",
            instruction: "Click 'Plans' or 'Billing' in the settings sidebar.",
            targetType: "link",
          },
          {
            stepNumber: 3,
            label: "Downgrade",
            instruction: "Click 'Downgrade' next to your current plan to switch to the free tier.",
            targetType: "button",
            decoyWarning: "Notion calls cancellation 'Downgrade' — there is no 'Cancel subscription' button.",
          },
        ],
        darkPatternWarnings: [
          "Cancellation disguised as 'Downgrade'",
          "Team workspace billing requires admin role",
        ],
        lastVerifiedDate: "2026-10-22",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // ChatGPT / OpenAI
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "openai",
    providerName: "OpenAI (ChatGPT)",
    providerDomain: "openai.com",
    aliases: ["openai", "chatgpt", "chatgpt plus", "chatgpt pro", "gpt plus", "gpt-4"],
    products: ["ChatGPT Plus", "ChatGPT Pro", "API Usage"],
    category: "AI Assistant",
    supportedActions: [
      {
        actionType: "cancel_subscription",
        targetUrl: "https://chatgpt.com/#settings/ManageSubscription",
        requiresAuth: true,
        isModalOrInPage: true,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Open Settings",
            instruction: "Go to chatgpt.com, click your profile icon in the bottom left, then click 'Settings'.",
            targetType: "button",
          },
          {
            stepNumber: 2,
            label: "Manage Subscription",
            instruction: "Click 'Manage my subscription'. This opens the Stripe customer portal.",
            targetType: "button",
          },
          {
            stepNumber: 3,
            label: "Cancel Plan",
            instruction: "In the Stripe portal, click 'Cancel plan' and confirm.",
            targetType: "button",
            decoyWarning: "The Stripe portal may offer 'Pause' — only use this if you want temporary suspension, not cancellation.",
          },
        ],
        darkPatternWarnings: [
          "Cancellation managed through third-party Stripe portal, not directly in ChatGPT",
          "'Manage subscription' link may redirect to a Stripe-hosted page",
        ],
        lastVerifiedDate: "2026-10-22",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // Microsoft 365
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "microsoft365",
    providerName: "Microsoft 365",
    providerDomain: "microsoft.com",
    aliases: ["microsoft 365", "m365", "office 365", "office", "microsoft office", "onedrive"],
    products: ["Personal", "Family", "Business Basic", "Business Standard"],
    category: "Productivity Suite",
    supportedActions: [
      {
        actionType: "cancel_subscription",
        targetUrl: "https://account.microsoft.com/services",
        requiresAuth: true,
        isModalOrInPage: false,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Open Services",
            instruction: "Navigate to account.microsoft.com/services and sign in with your Microsoft account.",
            targetType: "link",
          },
          {
            stepNumber: 2,
            label: "Manage M365",
            instruction: "Find your Microsoft 365 subscription and click 'Manage'.",
            targetType: "button",
          },
          {
            stepNumber: 3,
            label: "Cancel",
            instruction: "Click 'Cancel' or 'Turn off recurring billing', then confirm.",
            targetType: "button",
            decoyWarning: "Microsoft shows multiple 'Why are you leaving?' screens and discount offers before the actual cancel button.",
          },
        ],
        darkPatternWarnings: [
          "Multiple retention screens and exit surveys before final cancellation",
          "Business subscriptions require admin.microsoft.com instead",
        ],
        lastVerifiedDate: "2026-10-22",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // Canva
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "canva",
    providerName: "Canva",
    providerDomain: "canva.com",
    aliases: ["canva", "canva pro", "canva teams"],
    products: ["Pro", "Teams"],
    category: "Design Platform",
    supportedActions: [
      {
        actionType: "cancel_subscription",
        targetUrl: "https://www.canva.com/settings/billing-and-plans",
        requiresAuth: true,
        isModalOrInPage: false,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Open Billing",
            instruction: "Go to canva.com/settings/billing-and-plans.",
            targetType: "link",
          },
          {
            stepNumber: 2,
            label: "Cancel",
            instruction: "Click 'Cancel subscription' or 'Cancel plan' under your active plan.",
            targetType: "button",
            decoyWarning: "Canva may show a 'Pause for 1 month' option — this only delays the charge, it does not cancel.",
          },
          {
            stepNumber: 3,
            label: "Confirm",
            instruction: "Select a reason and confirm cancellation.",
            targetType: "button",
          },
        ],
        darkPatternWarnings: [
          "'Pause for 1 month' option shown before cancel to delay rather than stop billing",
          "Retention offers with discounts appear before final confirmation",
        ],
        lastVerifiedDate: "2026-10-22",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // Vercel
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "vercel",
    providerName: "Vercel",
    providerDomain: "vercel.com",
    aliases: ["vercel", "vercel pro", "vercel team"],
    products: ["Pro", "Team", "Enterprise"],
    category: "Cloud Hosting & Deployment",
    supportedActions: [
      {
        actionType: "cancel_subscription",
        targetUrl: "https://vercel.com/account/billing",
        requiresAuth: true,
        isModalOrInPage: false,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Open Billing",
            instruction: "Navigate to vercel.com/account/billing (or vercel.com/teams/{team}/settings/billing for team plans).",
            targetType: "link",
          },
          {
            stepNumber: 2,
            label: "Manage Plan",
            instruction: "Click 'Manage Subscription' or 'Change Plan'.",
            targetType: "button",
          },
          {
            stepNumber: 3,
            label: "Downgrade",
            instruction: "Select 'Hobby' (free tier) to downgrade, or follow the cancellation prompts.",
            targetType: "button",
            decoyWarning: "Downgrading removes team features and some deployment capabilities.",
          },
        ],
        darkPatternWarnings: [
          "Cancellation framed as 'downgrade' rather than explicit cancel",
          "Team plans require team owner access",
        ],
        lastVerifiedDate: "2026-10-22",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // Figma
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "figma",
    providerName: "Figma",
    providerDomain: "figma.com",
    aliases: ["figma", "figma pro", "figma organization"],
    products: ["Professional", "Organization", "Enterprise"],
    category: "Design Tool",
    supportedActions: [
      {
        actionType: "cancel_subscription",
        targetUrl: "https://www.figma.com/settings",
        requiresAuth: true,
        isModalOrInPage: false,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Open Settings",
            instruction: "Go to figma.com/settings for personal, or your team admin settings for team plans.",
            targetType: "link",
          },
          {
            stepNumber: 2,
            label: "Plan & Billing",
            instruction: "Navigate to the 'Plan' or 'Billing' section.",
            targetType: "link",
          },
          {
            stepNumber: 3,
            label: "Downgrade",
            instruction: "Click 'Downgrade to Starter' or 'Cancel plan' and confirm.",
            targetType: "button",
            decoyWarning: "Figma uses 'Downgrade to Starter' as the cancel action.",
          },
        ],
        darkPatternWarnings: [
          "No explicit 'Cancel' — uses 'Downgrade to Starter' language",
          "Organization plans require admin-level access",
        ],
        lastVerifiedDate: "2026-10-22",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // Cursor (AI Code Editor)
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "cursor",
    providerName: "Cursor",
    providerDomain: "cursor.com",
    aliases: ["cursor", "cursor pro", "cursor ai"],
    products: ["Pro", "Business"],
    category: "AI Code Editor",
    supportedActions: [
      {
        actionType: "cancel_subscription",
        targetUrl: "https://www.cursor.com/settings",
        requiresAuth: true,
        isModalOrInPage: false,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Open Settings",
            instruction: "Go to cursor.com/settings and sign in.",
            targetType: "link",
          },
          {
            stepNumber: 2,
            label: "Manage Subscription",
            instruction: "Under 'Subscription', click 'Manage subscription'. This typically opens a Stripe portal.",
            targetType: "button",
          },
          {
            stepNumber: 3,
            label: "Cancel",
            instruction: "In the Stripe customer portal, click 'Cancel plan' and confirm.",
            targetType: "button",
          },
        ],
        darkPatternWarnings: [
          "Managed via Stripe customer portal — not directly within Cursor",
        ],
        lastVerifiedDate: "2026-10-22",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // YouTube Premium / YouTube Music
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "youtube",
    providerName: "YouTube Premium",
    providerDomain: "youtube.com",
    aliases: ["youtube", "youtube premium", "youtube music", "yt premium"],
    products: ["Premium Individual", "Premium Family", "Music Premium"],
    category: "Video & Music Streaming",
    supportedActions: [
      {
        actionType: "cancel_subscription",
        targetUrl: "https://www.youtube.com/paid_memberships",
        requiresAuth: true,
        isModalOrInPage: false,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Open Memberships",
            instruction: "Navigate to youtube.com/paid_memberships and sign in.",
            targetType: "link",
          },
          {
            stepNumber: 2,
            label: "Manage Membership",
            instruction: "Click 'Manage membership' next to YouTube Premium.",
            targetType: "button",
          },
          {
            stepNumber: 3,
            label: "Deactivate",
            instruction: "Click 'Deactivate' and then 'Continue to cancel'. Confirm on the final screen.",
            targetType: "button",
            decoyWarning: "Google may show a 'Pause membership' option — this only suspends charges temporarily.",
          },
        ],
        darkPatternWarnings: [
          "'Pause' option displayed prominently before the actual cancel option",
          "Multiple confirmation steps with 'We'll miss you' retention messaging",
        ],
        lastVerifiedDate: "2026-10-22",
      },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────
  // Curated Free & Open-Source Software (Zero Recurring Billing)
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "wikipedia",
    providerName: "Wikipedia (Wikimedia Foundation)",
    providerDomain: "wikipedia.org",
    aliases: ["wikipedia", "wikimedia", "wiki", "wikimedia foundation"],
    products: ["Free Online Encyclopedia", "Wikipedia Articles"],
    category: "Free Knowledge & Non-Profit",
    isFreeService: true,
    supportedActions: [
      {
        actionType: "zero_billing_free",
        targetUrl: "https://en.wikipedia.org",
        requiresAuth: false,
        isModalOrInPage: false,
        navigationPath: [
          {
            stepNumber: 1,
            label: "100% Free & Open Access",
            instruction: "Wikipedia is operated by the non-profit Wikimedia Foundation. There are zero subscription tiers, no paywalls, and no recurring fees.",
            targetType: "link",
          },
          {
            stepNumber: 2,
            label: "Voluntary Donations",
            instruction: "One-time donations never auto-renew. If you previously set up an optional recurring monthly donation, manage or stop it at donate.wikimedia.org.",
            targetType: "link",
          },
          {
            stepNumber: 3,
            label: "Optional Account Removal",
            instruction: "Reading and editing do not require payment. If you have an optional user account, you can manage or delete preferences in Special:Preferences.",
            targetType: "link",
          },
        ],
        darkPatternWarnings: [
          "Safe from billing traps: Wikipedia has no subscription paywalls or hidden credit card charges.",
        ],
        lastVerifiedDate: "2026-10-24",
      },
    ],
  },
  {
    id: "blender",
    providerName: "Blender 3D",
    providerDomain: "blender.org",
    aliases: ["blender", "blender 3d", "blender foundation", "blender.org"],
    products: ["Blender Open Source 3D Suite"],
    category: "Open Source 3D Creation Suite",
    isFreeService: true,
    supportedActions: [
      {
        actionType: "zero_billing_free",
        targetUrl: "https://www.blender.org",
        requiresAuth: false,
        isModalOrInPage: false,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Free & Open Source Software (GPL)",
            instruction: "Blender is 100% free software forever. All modeling, animation, rendering, and sculpting tools have zero subscription cost.",
            targetType: "link",
          },
          {
            stepNumber: 2,
            label: "No Credit Card or Activation",
            instruction: "You never need to enter billing details, payment methods, or purchase license keys to run Blender.",
            targetType: "link",
          },
          {
            stepNumber: 3,
            label: "Development Fund is Voluntary",
            instruction: "If you voluntarily joined the Blender Development Fund (fund.blender.org), you can cancel recurring sponsorship donations in your donor dashboard.",
            targetType: "link",
          },
        ],
        darkPatternWarnings: [
          "Safe: Zero subscription fees, zero telemetry paywalls, and zero dark patterns.",
        ],
        lastVerifiedDate: "2026-10-24",
      },
    ],
  },
  {
    id: "signal",
    providerName: "Signal Messenger",
    providerDomain: "signal.org",
    aliases: ["signal", "signal app", "signal messenger", "signal foundation"],
    products: ["Encrypted Private Messaging"],
    category: "Non-Profit Private Communications",
    isFreeService: true,
    supportedActions: [
      {
        actionType: "zero_billing_free",
        targetUrl: "https://signal.org",
        requiresAuth: false,
        isModalOrInPage: false,
        navigationPath: [
          {
            stepNumber: 1,
            label: "100% Free Non-Profit Service",
            instruction: "Signal is developed by the 501(c)(3) Signal Technology Foundation. No subscriptions, no ads, and no selling of user data.",
            targetType: "link",
          },
          {
            stepNumber: 2,
            label: "Optional In-App Boost Badges",
            instruction: "If you set up an optional recurring monthly donation badge, cancel it anytime inside the Signal app: Settings -> Donate to Signal -> Cancel Boost.",
            targetType: "button",
          },
          {
            stepNumber: 3,
            label: "Account Deletion",
            instruction: "To completely deregister your phone number and delete data, open the app: Settings -> Account -> Delete Account.",
            targetType: "button",
          },
        ],
        darkPatternWarnings: [
          "Safe: Signal has zero recurring subscription requirements or predatory retention traps.",
        ],
        lastVerifiedDate: "2026-10-24",
      },
    ],
  },
  {
    id: "vlc",
    providerName: "VLC Media Player",
    providerDomain: "videolan.org",
    aliases: ["vlc", "vlc player", "vlc media player", "videolan"],
    products: ["VLC Media Player"],
    category: "Free & Open Source Multimedia Player",
    isFreeService: true,
    supportedActions: [
      {
        actionType: "zero_billing_free",
        targetUrl: "https://www.videolan.org",
        requiresAuth: false,
        isModalOrInPage: false,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Free & Open Source Multimedia Player",
            instruction: "VLC is created by the VideoLAN non-profit organization. It is completely free with no paid tiers, ads, or spyware.",
            targetType: "link",
          },
          {
            stepNumber: 2,
            label: "Zero Recurring Billing",
            instruction: "No credit cards, licenses, or subscription contracts exist. You will never be billed for VLC.",
            targetType: "link",
          },
          {
            stepNumber: 3,
            label: "Uninstall Directly from System",
            instruction: "To remove VLC, uninstall it from your operating system's settings (Windows Apps & Features or macOS Applications).",
            targetType: "link",
          },
        ],
        darkPatternWarnings: [
          "Safe: Watch out only for third-party scam clone websites. Download only from the verified official videolan.org domain.",
        ],
        lastVerifiedDate: "2026-10-24",
      },
    ],
  },
  {
    id: "ubuntu",
    providerName: "Ubuntu Linux (Canonical)",
    providerDomain: "ubuntu.com",
    aliases: ["ubuntu", "ubuntu linux", "canonical", "ubuntu os"],
    products: ["Ubuntu Desktop", "Ubuntu Server"],
    category: "Open Source Operating System",
    isFreeService: true,
    supportedActions: [
      {
        actionType: "zero_billing_free",
        targetUrl: "https://ubuntu.com",
        requiresAuth: false,
        isModalOrInPage: false,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Open Source OS — Free Forever",
            instruction: "Ubuntu Desktop and Server are freely available under open-source licenses with zero purchase or subscription cost.",
            targetType: "link",
          },
          {
            stepNumber: 2,
            label: "Ubuntu Pro Free Personal Tier",
            instruction: "Ubuntu Pro is free for personal use on up to 5 machines. If subscribed to paid enterprise tiers, manage machines at ubuntu.com/pro/dashboard.",
            targetType: "link",
          },
          {
            stepNumber: 3,
            label: "Zero Credit Card Traps",
            instruction: "Standard downloads and updates never require payment details or recurring billing.",
            targetType: "link",
          },
        ],
        darkPatternWarnings: [
          "Safe: No automatic charges or consumer billing traps.",
        ],
        lastVerifiedDate: "2026-10-24",
      },
    ],
  },
  {
    id: "whatsapp",
    providerName: "WhatsApp Messenger",
    providerDomain: "whatsapp.com",
    aliases: ["whatsapp", "whatsapp messenger", "wa"],
    products: ["WhatsApp Consumer Messaging"],
    category: "Free Consumer Messaging",
    isFreeService: true,
    supportedActions: [
      {
        actionType: "zero_billing_free",
        targetUrl: "https://www.whatsapp.com",
        requiresAuth: false,
        isModalOrInPage: false,
        navigationPath: [
          {
            stepNumber: 1,
            label: "Free Consumer Messaging",
            instruction: "WhatsApp is 100% free for consumers worldwide (the old $0.99/year fee was eliminated in 2016). There is no subscription billing.",
            targetType: "link",
          },
          {
            stepNumber: 2,
            label: "No Card Stored for Consumer Service",
            instruction: "There are no monthly auto-renewals or credit card deductions for personal WhatsApp accounts.",
            targetType: "link",
          },
          {
            stepNumber: 3,
            label: "Delete Account in App",
            instruction: "To terminate your account and wipe backups, open the app: Settings -> Account -> Delete My Account.",
            targetType: "button",
          },
        ],
        darkPatternWarnings: [
          "Safe: Consumer messaging has no monthly billing traps.",
        ],
        lastVerifiedDate: "2026-10-24",
      },
    ],
  },
];
