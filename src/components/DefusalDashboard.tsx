"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Home,
  Search,
  Bookmark,
  Clock,
  Link2,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Check,
  Star,
  Trash2,
  Sparkles,
  ExternalLink,
  X,
  Shield,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { InAppDefusalWindow } from "./InAppDefusalWindow";
import { StickAngerSearcher } from "./StickAngerSearcher";
import { PoppableWaterOrb } from "./PoppableWaterOrb";
import { AwsChipIcon, AwsRowIcon, AwsCardIcon } from "./AwsLogo";
import { SubscriptionDefusalResponse } from "@/lib/types";
import type { DestinationNode } from "@/lib/engine/types";
import { DESTINATION_REGISTRY } from "@/lib/engine/registry";
import { resolve } from "@/lib/engine/resolver";

export type SidebarTab = "overview" | "find" | "saved" | "history";
export type TabType = "search" | "url";
export type ServiceKey = "google_cloud" | "aws" | "adobe" | "microsoft_365" | "lovable" | string;

export interface ServiceData {
  id: string;
  name: string;
  actionTitle: string;
  badgeText: string;
  trail: string[];
  verificationNote: string;
  directUrl: string;
  category?: string;
  isFreeService?: boolean;
  inAppSteps: Array<{
    stepNumber: number;
    instruction: string;
    decoyWarning?: string;
  }>;
  darkPatterns?: string[];
}

export interface DefusalDashboardProps {
  data?: SubscriptionDefusalResponse | null;
  destination?: DestinationNode | null;
  initialTab?: SidebarTab;
  onReset?: () => void;
}

const PRESET_SERVICES: Record<string, ServiceData> = {
  google_cloud: {
    id: "google_cloud",
    name: "Google Cloud",
    actionTitle: "Manage billing subscription",
    badgeText: "Destination found",
    trail: ["Billing account", "Subscriptions", "Manage subscription"],
    verificationNote: "Verified from official navigation",
    directUrl: "https://console.cloud.google.com/billing",
    category: "Cloud Infrastructure",
    inAppSteps: [
      {
        stepNumber: 1,
        instruction: "Open Google Cloud Console at console.cloud.google.com/billing and select your active project.",
        decoyWarning: "Ensure you are in the correct Cloud Billing Account if your organization has multiple accounts.",
      },
      {
        stepNumber: 2,
        instruction: "In the left navigation menu, click 'Subscriptions & Marketplace'.",
        decoyWarning: "Do not choose 'Payment method' or 'Budget alerts' — navigate to Subscriptions.",
      },
      {
        stepNumber: 3,
        instruction: "Click 'Manage subscription' on the active license and toggle auto-renewal to Off.",
        decoyWarning: "Confirm disabling auto-renew rather than deleting your IAM project identity.",
      },
    ],
    darkPatterns: ["Requires Billing Admin role", "Closing billing account shuts down all linked projects"],
  },
  aws: {
    id: "aws",
    name: "AWS",
    actionTitle: "Cancel subscription",
    badgeText: "Destination found",
    trail: ["Billing & Cost Management", "Subscriptions", "Manage & Cancel"],
    verificationNote: "Verified from official navigation",
    directUrl: "https://console.aws.amazon.com/billing/home",
    category: "Cloud Infrastructure",
    inAppSteps: [
      {
        stepNumber: 1,
        instruction: "Log in to the AWS Management Console and open Billing & Cost Management.",
        decoyWarning: "Requires root or IAM billing management permissions.",
      },
      {
        stepNumber: 2,
        instruction: "Under Bills, select 'Subscriptions / Marketplace Purchases'.",
        decoyWarning: "Do not simply stop EC2 instances; the monthly SaaS subscription will continue billing.",
      },
      {
        stepNumber: 3,
        instruction: "Select the subscription and click 'Manage subscription' -> 'Cancel subscription'.",
        decoyWarning: "Review final pro-rated termination notice and confirm permanent termination.",
      },
    ],
    darkPatterns: ["Marketplace SaaS vs account closure are different", "Must be root to close account"],
  },
  adobe: {
    id: "adobe",
    name: "Adobe",
    actionTitle: "Turn off auto-renewal",
    badgeText: "Destination found",
    trail: ["account.adobe.com", "Plans", "Manage Plan", "Cancel Plan"],
    verificationNote: "Verified from official navigation",
    directUrl: "https://account.adobe.com/plans",
    category: "Creative Software",
    inAppSteps: [
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
    darkPatterns: ["Hidden 50% early termination fee", "4-page retention quiz with discount bribes"],
  },
  microsoft_365: {
    id: "microsoft_365",
    name: "Microsoft 365",
    actionTitle: "Cancel recurring billing",
    badgeText: "Destination found",
    trail: ["admin.microsoft.com", "Billing", "Your products", "Cancel subscription"],
    verificationNote: "Verified from official navigation",
    directUrl: "https://admin.microsoft.com",
    category: "Productivity",
    inAppSteps: [
      {
        stepNumber: 1,
        instruction: "Go to Microsoft 365 Admin Center at admin.microsoft.com.",
        decoyWarning: "Must be signed in with global admin credentials.",
      },
      {
        stepNumber: 2,
        instruction: "In the left navigation drawer, go to Billing > Your products.",
        decoyWarning: "Do not click 'Licenses' — you must cancel the root product tier.",
      },
      {
        stepNumber: 3,
        instruction: "Select the subscription, choose 'Edit recurring billing', and toggle to Off or click 'Cancel subscription'.",
        decoyWarning: "Turn off recurring billing completely to prevent automatic renewal charges.",
      },
    ],
    darkPatterns: ["Hidden behind 'Edit recurring billing' rather than direct cancel"],
  },
  lovable: {
    id: "lovable",
    name: "Lovable",
    actionTitle: "Downgrade to Free",
    badgeText: "Destination found",
    trail: ["lovable.dev/settings/billing", "Manage Subscription", "Downgrade to Free"],
    verificationNote: "Verified from official navigation",
    directUrl: "https://lovable.dev/settings/billing",
    category: "AI Code Builder",
    inAppSteps: [
      {
        stepNumber: 1,
        instruction: "Go to lovable.dev/settings/billing and locate your active Lovable Pro card.",
        decoyWarning: "Do not look for a 'Cancel' link on the main page — it does not exist.",
      },
      {
        stepNumber: 2,
        instruction: "Click the 'Manage' button next to the Lovable Pro title.",
        decoyWarning: "Easy to overlook — it says 'Manage', never 'Cancel'.",
      },
      {
        stepNumber: 3,
        instruction: "Inside the popup modal, select 'Downgrade to Free' to cease recurring billing.",
        decoyWarning: "Ignore Stripe billing redirect links.",
      },
    ],
    darkPatterns: ["Hidden Manage button", "Word 'Cancel' completely absent"],
  },
  chatgpt: {
    id: "chatgpt",
    name: "ChatGPT Plus",
    actionTitle: "Cancel subscription",
    badgeText: "Destination found",
    trail: ["chatgpt.com", "Profile Avatar", "Settings", "Subscription", "Manage", "Cancel"],
    verificationNote: "Verified from official navigation",
    directUrl: "https://chatgpt.com/#settings/Account",
    category: "AI & Assistants",
    inAppSteps: [
      {
        stepNumber: 1,
        instruction: "Open ChatGPT at chatgpt.com and click your Profile avatar in the bottom-left sidebar.",
        decoyWarning: "Ensure you are logged into the exact personal or team account that holds the Plus subscription.",
      },
      {
        stepNumber: 2,
        instruction: "Select 'Settings' from the popup menu, then click the 'Subscription' tab.",
        decoyWarning: "Do not confuse 'Data Controls' or 'Security' with 'Subscription'.",
      },
      {
        stepNumber: 3,
        instruction: "Click 'Manage' to open the Stripe self-serve portal, then select 'Cancel Plan'.",
        decoyWarning: "If subscribed through Apple App Store or Google Play, you must cancel inside iOS/Android subscription settings.",
      },
    ],
    darkPatterns: ["Multi-provider trap: iOS/Android store purchases cannot be cancelled on web", "Auto-renewal renews exactly on the hour of purchase"],
  },
  gemini: {
    id: "gemini",
    name: "Google Gemini Advanced",
    actionTitle: "Cancel recurring membership",
    badgeText: "Destination found",
    trail: ["gemini.google.com", "Settings", "Manage Subscription", "Google One", "Cancel membership"],
    verificationNote: "Verified from official navigation",
    directUrl: "https://one.google.com/settings",
    category: "AI & Cloud",
    inAppSteps: [
      {
        stepNumber: 1,
        instruction: "Go to Google One settings at one.google.com/settings using the Google account linked to Gemini.",
        decoyWarning: "Gemini Advanced is billed through Google One AI Premium plan, not standalone Gemini.",
      },
      {
        stepNumber: 2,
        instruction: "Under 'Membership plan', click 'Cancel membership'.",
        decoyWarning: "Decline promotional offers to pause membership or switch to lower cloud storage.",
      },
      {
        stepNumber: 3,
        instruction: "Click 'Cancel membership' on the confirmation screen to finish.",
        decoyWarning: "Your Gemini Advanced features stay active until the end of current cycle.",
      },
    ],
    darkPatterns: ["Billed through Google One umbrella rather than Gemini direct", "Storage downgrade warnings are alarming"],
  },
  figma: {
    id: "figma",
    name: "Figma",
    actionTitle: "Downgrade to Starter",
    badgeText: "Destination found",
    trail: ["figma.com/settings", "Plan & Billing", "Downgrade to Starter"],
    verificationNote: "Verified from official navigation",
    directUrl: "https://www.figma.com/settings",
    category: "Design Tool",
    inAppSteps: [
      {
        stepNumber: 1,
        instruction: "Go to figma.com/settings for your account or team settings.",
        decoyWarning: "Organization or Enterprise plans require team admin credentials.",
      },
      {
        stepNumber: 2,
        instruction: "Navigate to the 'Plan' or 'Billing' section.",
        decoyWarning: "Do not click 'Add seats' or 'Upgrade' — navigate directly to Plan settings.",
      },
      {
        stepNumber: 3,
        instruction: "Click 'Downgrade to Starter' to cease recurring subscription billing.",
        decoyWarning: "Figma labels cancellation as 'Downgrade to Starter' — there is no button called 'Cancel subscription'.",
      },
    ],
    darkPatterns: ["Cancellation framed as 'Downgrade to Starter'", "Team admin privileges strictly enforced"],
  },
};

// ── Brand Icons ─────────────────────────────────────────────────────────────

function GoogleCloudIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <path
        d="M19.35 10.04C18.67 10.02 18 10 17.31 10 10.51 10 5 15.51 5 22.31c0 6.22 4.6 11.36 10.59 12.18.23-1.63.85-3.15 1.78-4.45-3.92-.71-6.87-4.14-6.87-8.23 0-4.6 3.73-8.33 8.33-8.33.67 0 1.32.08 1.94.23.95-2.18 2.72-3.88 4.96-4.75-.46-.57-.96-1.07-1.51-1.49-.66-.49-1.4-.87-2.19-1.12-.58-.19-1.18-.3-1.78-.31z"
        fill="#EA4335"
      />
      <path
        d="M38.5 19c-.3 0-.6.02-.9.05C36.1 14.3 31.5 11 26 11c-3.1 0-5.9 1.1-8.1 3 1.3 1.1 2.3 2.5 2.9 4.1 1.6-.7 3.3-1.1 5.2-1.1 4.7 0 8.6 3.2 9.7 7.6.6-.1 1.2-.2 1.8-.2 3.9 0 7 3.1 7 7s-3.1 7-7 7H17c-2.4 0-4.6-.9-6.3-2.3-1.1 1.3-1.8 3-1.8 4.8 0 4.1 3.4 7.5 7.5 7.5h22.1c6.4 0 11.5-5.1 11.5-11.5S44.9 19 38.5 19z"
        fill="#4285F4"
      />
      <path
        d="M38.5 19c-.3 0-.6.02-.9.05-1.1-3.3-3.6-5.8-6.9-7-1.1 1.6-1.8 3.5-1.8 5.6 0 1.2.2 2.3.7 3.3-1.1-.3-2.3-.5-3.6-.5-3.3 0-6.2 1.5-8.1 3.9.7 1.8 1.9 3.3 3.5 4.3 1.3-.8 2.9-1.2 4.6-1.2 4.7 0 8.6 3.2 9.7 7.6.6-.1 1.2-.2 1.8-.2 3.9 0 7 3.1 7 7s-3.1 7-7 7h-2.1c1.3 1.4 2.1 3.3 2.1 5.5 0 .2 0 .4-.02.5h.02c6.4 0 11.5-5.1 11.5-11.5S44.9 19 38.5 19z"
        fill="#FBBC05"
      />
      <path
        d="M17 38.5h21.5c4.1 0 7.5-3.4 7.5-7.5s-3.4-7.5-7.5-7.5c-.6 0-1.2.1-1.8.2-1.1-4.4-5-7.6-9.7-7.6-1.9 0-3.6.4-5.2 1.1-.6-1.6-1.6-3-2.9-4.1-1.3 1.2-2.3 2.7-3 4.4 2.8 1.4 4.8 4.2 4.9 7.5-2.2.3-4.1 1.5-5.2 3.3-1.4 2.3-1.6 5.1-.5 7.5 1.1 2.2 3.2 3.7 5.7 3.9.4.1.8.1 1.2.1z"
        fill="#34A853"
      />
    </svg>
  );
}

function AdobeChipIcon() {
  return (
    <div className="w-5 h-5 rounded-md bg-[#eb1000] flex items-center justify-center shrink-0">
      <svg className="w-3 h-3 fill-white" viewBox="0 0 30 26">
        <polygon points="19,0 30,26 23.3,26 18.2,13.7 14.5,22.4 18.7,22.4 19.9,26 9.8,26" />
        <polygon points="11,0 0,26 6.7,26 12.3,12.5" />
      </svg>
    </div>
  );
}

function AdobeRowIcon() {
  return (
    <div className="w-10 h-10 rounded-xl bg-[#eb1000] flex items-center justify-center shrink-0 shadow-xs">
      <svg className="w-6 h-6 fill-white" viewBox="0 0 30 26">
        <polygon points="19,0 30,26 23.3,26 18.2,13.7 14.5,22.4 18.7,22.4 19.9,26 9.8,26" />
        <polygon points="11,0 0,26 6.7,26 12.3,12.5" />
      </svg>
    </div>
  );
}

function Microsoft365ChipIcon() {
  return (
    <div className="w-4 h-4 grid grid-cols-2 gap-0.5 shrink-0">
      <div className="bg-[#f25022] rounded-[1px] w-1.5 h-1.5" />
      <div className="bg-[#7fba00] rounded-[1px] w-1.5 h-1.5" />
      <div className="bg-[#00a4ef] rounded-[1px] w-1.5 h-1.5" />
      <div className="bg-[#ffb900] rounded-[1px] w-1.5 h-1.5" />
    </div>
  );
}

function LovableChipIcon() {
  return (
    <div className="w-5 h-5 rounded-md bg-[#F4F1EA] flex items-center justify-center shrink-0 border border-slate-200/60">
      <svg className="w-3.5 h-3.5" viewBox="0 0 44 44" fill="none">
        <path
          d="M13 28V16C13 11 16.8 7 21.5 7C26.2 7 30 11 30 16V18.5C30 18.8 30.2 19 30.5 19C33.5 19 36 21.5 36 24.5C36 27.5 33.5 30 30.5 30H17C14.8 30 13 28.2 13 26Z"
          fill="url(#lovableChipGrad)"
        />
        <defs>
          <linearGradient id="lovableChipGrad" x1="18" y1="7" x2="26" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF601C" />
            <stop offset="48%" stopColor="#FF2B75" />
            <stop offset="100%" stopColor="#6C5CE7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function LovableRowIcon() {
  return (
    <div className="w-10 h-10 rounded-xl bg-[#F4F1EA] border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
      <svg className="w-6 h-6" viewBox="0 0 44 44" fill="none">
        <path
          d="M13 28V16C13 11 16.8 7 21.5 7C26.2 7 30 11 30 16V18.5C30 18.8 30.2 19 30.5 19C33.5 19 36 21.5 36 24.5C36 27.5 33.5 30 30.5 30H17C14.8 30 13 28.2 13 26Z"
          fill="url(#lovableRowGrad)"
        />
        <defs>
          <linearGradient id="lovableRowGrad" x1="18" y1="7" x2="26" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF601C" />
            <stop offset="48%" stopColor="#FF2B75" />
            <stop offset="100%" stopColor="#6C5CE7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function ChatGptChipIcon() {
  return (
    <div className="w-5 h-5 rounded-md bg-slate-900 flex items-center justify-center shrink-0">
      <svg
        className="w-3.5 h-3.5 text-white"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <path
            key={angle}
            d="M50 36.5 L65 27.8 C72 23.8 81 26.2 85 33.2 C89 40.2 86.6 49.2 79.6 53.2 L64.6 61.9 L50 53.5"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
      </svg>
    </div>
  );
}

function FigmaChipIcon() {
  return (
    <div className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0">
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
        <path d="M8 24C10.2091 24 12 22.2091 12 20V16H8C5.79086 16 4 17.7909 4 20C4 22.2091 5.79086 24 8 24Z" fill="#0ACF83" />
        <path d="M4 12C4 9.79086 5.8 8 8 8H12V16H8C5.8 16 4 14.2091 4 12Z" fill="#A259FF" />
        <path d="M4 4C4 1.79086 5.8 0 8 0H12V8H8C5.79086 8 4 6.20914 4 4Z" fill="#F24E1E" />
        <path d="M12 0H16C18.2091 0 20 1.79086 20 4C20 6.20914 18.2091 8 16 8H12V0Z" fill="#FF7262" />
        <circle cx="16" cy="12" r="4" fill="#1ABCFE" />
      </svg>
    </div>
  );
}

function GenericBrandIcon({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initial = name.charAt(0).toUpperCase();
  const dim = size === "sm" ? "w-5 h-5 text-[10px]" : size === "lg" ? "w-12 h-12 text-lg" : "w-10 h-10 text-sm";
  return (
    <div className={`${dim} rounded-xl bg-linear-to-br from-[#1658eb] to-[#0c3898] text-white font-bold flex items-center justify-center shrink-0 shadow-xs`}>
      {initial}
    </div>
  );
}

function DynamicBrandIcon({
  name,
  domain,
  size = "row",
}: {
  name: string;
  domain?: string;
  size?: "sm" | "row" | "card";
}) {
  const [imgError, setImgError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const cleanDomain = useMemo(() => {
    if (!domain) {
      const clean = name.toLowerCase().replace(/[^a-z0-9]/g, "");
      return `${clean}.com`;
    }
    return domain.replace(/^https?:\/\//i, "").split("/")[0].split(":")[0];
  }, [domain, name]);

  const primaryUrl = `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
  const fallbackUrl = `https://icons.duckduckgo.com/ip3/${cleanDomain}.ico`;

  const dim =
    size === "card"
      ? "w-12 h-12 rounded-2xl"
      : size === "row"
      ? "w-10 h-10 rounded-xl"
      : "w-5 h-5 rounded-md";
  const imgDim =
    size === "card"
      ? "w-7 h-7"
      : size === "row"
      ? "w-5 h-5"
      : "w-3.5 h-3.5";

  if (imgError) {
    return <GenericBrandIcon name={name} size={size === "card" ? "lg" : size === "row" ? "md" : "sm"} />;
  }

  return (
    <div
      className={`${dim} bg-white border border-slate-200/90 flex items-center justify-center shrink-0 shadow-xs overflow-hidden p-1`}
      title={`${name} logo`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={useFallback ? fallbackUrl : primaryUrl}
        alt={`${name} icon`}
        className={`${imgDim} object-contain rounded-xs`}
        onError={() => {
          if (!useFallback) {
            setUseFallback(true);
          } else {
            setImgError(true);
          }
        }}
      />
    </div>
  );
}

function EconetEcoAiIcon({ size = "row" }: { size?: "sm" | "row" | "card" }) {
  if (size === "card") {
    return (
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#002f6c] via-[#004b9b] to-[#0072ce] border border-[#004b9b] flex flex-col items-center justify-center shrink-0 shadow-xs relative overflow-hidden text-white" title="ecoAI Tokens (Econet Wireless Zimbabwe)">
        <div className="flex items-center gap-0.5 font-black text-xs tracking-tight">
          <span className="text-[#38bdf8]">eco</span>
          <span className="text-white">AI</span>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-bold text-amber-300 mt-0.5">
          <span>🇿🇼</span>
          <span className="tracking-widest uppercase text-[8px] text-slate-200">ZIM</span>
        </div>
        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-amber-400 rounded-bl-xs" />
      </div>
    );
  }
  if (size === "sm") {
    return (
      <div className="w-5 h-5 rounded-md bg-[#002f6c] flex items-center justify-center shrink-0 border border-blue-900 text-white font-black text-[9px]" title="ecoAI Tokens (Econet Wireless Zimbabwe)">
        <span className="text-[#38bdf8]">e</span>
        <span className="text-white">A</span>
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#002f6c] to-[#0056b3] border border-blue-900 flex flex-col items-center justify-center shrink-0 shadow-xs text-white" title="ecoAI Tokens (Econet Wireless Zimbabwe)">
      <div className="flex items-center gap-0.5 font-bold text-[11px] leading-none">
        <span className="text-[#38bdf8]">eco</span>
        <span>AI</span>
      </div>
      <span className="text-[9px] text-amber-300 leading-none mt-0.5">🇿🇼</span>
    </div>
  );
}

function renderServiceIcon(id: string, name: string, size: "sm" | "row" | "card", directUrl?: string) {
  const clean = id.toLowerCase();
  if (clean.includes("ecoai") || clean.includes("econet")) {
    return <EconetEcoAiIcon size={size} />;
  }
  if (clean.includes("google") || clean.includes("gcp") || clean.includes("gemini")) {
    return size === "card" ? <GoogleCloudIcon className="w-12 h-12 shrink-0" /> : <GoogleCloudIcon className="w-5 h-5 shrink-0" />;
  }
  if (clean.includes("aws") || clean.includes("amazon")) {
    if (size === "card") return <AwsCardIcon />;
    return size === "sm" ? <AwsChipIcon /> : <AwsRowIcon />;
  }
  if (clean.includes("adobe")) {
    return size === "sm" ? <AdobeChipIcon /> : <AdobeRowIcon />;
  }
  if (clean.includes("microsoft") || clean.includes("365")) {
    if (size === "sm") return <Microsoft365ChipIcon />;
    return (
      <div className={`${size === "card" ? "w-11 h-11" : "w-10 h-10"} rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0`}>
        <Microsoft365ChipIcon />
      </div>
    );
  }
  if (clean.includes("lovable")) {
    if (size === "sm") return <LovableChipIcon />;
    if (size === "card") {
      return (
        <div className="w-12 h-12 rounded-2xl bg-[#F4F1EA] border border-slate-200/80 flex items-center justify-center shrink-0 shadow-xs">
          <svg className="w-7 h-7" viewBox="0 0 44 44" fill="none">
            <path
              d="M13 28V16C13 11 16.8 7 21.5 7C26.2 7 30 11 30 16V18.5C30 18.8 30.2 19 30.5 19C33.5 19 36 21.5 36 24.5C36 27.5 33.5 30 30.5 30H17C14.8 30 13 28.2 13 26Z"
              fill="url(#lovableCardGrad)"
            />
            <defs>
              <linearGradient id="lovableCardGrad" x1="18" y1="7" x2="26" y2="30" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF601C" />
                <stop offset="48%" stopColor="#FF2B75" />
                <stop offset="100%" stopColor="#6C5CE7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );
    }
    return <LovableRowIcon />;
  }
  if (clean.includes("openai") || clean.includes("chatgpt")) {
    const dim = size === "card" ? "w-12 h-12 rounded-2xl" : size === "sm" ? "w-5 h-5 rounded-md" : "w-10 h-10 rounded-xl";
    const iconDim = size === "card" ? "w-7 h-7" : size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
    return (
      <div className={`${dim} bg-slate-900 flex items-center justify-center shrink-0 shadow-xs`}>
        <svg
          className={`${iconDim} text-white`}
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <path
              key={angle}
              d="M50 36.5 L65 27.8 C72 23.8 81 26.2 85 33.2 C89 40.2 86.6 49.2 79.6 53.2 L64.6 61.9 L50 53.5"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </svg>
      </div>
    );
  }
  if (clean.includes("figma")) {
    if (size === "sm") return <FigmaChipIcon />;
    return (
      <div className={`${size === "card" ? "w-12 h-12" : "w-10 h-10"} rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs`}>
        <svg className={`${size === "card" ? "w-6 h-6" : "w-5 h-5"}`} viewBox="0 0 24 24" fill="none">
          <path d="M8 24C10.2091 24 12 22.2091 12 20V16H8C5.79086 16 4 17.7909 4 20C4 22.2091 5.79086 24 8 24Z" fill="#0ACF83" />
          <path d="M4 12C4 9.79086 5.8 8 8 8H12V16H8C5.8 16 4 14.2091 4 12Z" fill="#A259FF" />
          <path d="M4 4C4 1.79086 5.8 0 8 0H12V8H8C5.79086 8 4 6.20914 4 4Z" fill="#F24E1E" />
          <path d="M12 0H16C18.2091 0 20 1.79086 20 4C20 6.20914 18.2091 8 16 8H12V0Z" fill="#FF7262" />
          <circle cx="16" cy="12" r="4" fill="#1ABCFE" />
        </svg>
      </div>
    );
  }
  if (clean.includes("spotify")) {
    return (
      <div className={`${size === "card" ? "w-12 h-12" : size === "sm" ? "w-5 h-5 rounded-md" : "w-10 h-10 rounded-xl"} rounded-2xl bg-[#1db954] flex items-center justify-center shrink-0 shadow-xs`}>
        <svg className={`${size === "card" ? "w-7 h-7" : size === "sm" ? "w-3 h-3" : "w-6 h-6"}`} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#1ED760" />
          <path d="M17.5 17.2c-.2.3-.6.4-.9.2-2.5-1.5-5.6-1.8-9.3-1-.4.1-.7-.2-.8-.5-.1-.4.2-.7.5-.8 4.1-.9 7.5-.6 10.3 1.1.3.2.4.6.2 1zm1.2-2.7c-.3.4-.8.5-1.2.3-2.9-1.8-7.3-2.3-10.7-1.3-.4.1-.9-.1-1-.6-.1-.4.1-.9.6-1 3.9-1.2 8.7-.6 12 1.4.4.2.5.8.3 1.2zm.1-2.9c-3.5-2.1-9.2-2.3-12.6-1.2-.5.2-1.1-.1-1.3-.6-.2-.5.1-1.1.6-1.3 3.9-1.2 10.2-1 14.2 1.4.5.3.6.9.3 1.4-.3.5-.9.6-1.2.3z" fill="#000000" />
        </svg>
      </div>
    );
  }
  if (clean.includes("netflix")) {
    return (
      <div className={`${size === "card" ? "w-12 h-12" : size === "sm" ? "w-5 h-5 rounded-md" : "w-10 h-10 rounded-xl"} rounded-2xl bg-[#000000] flex items-center justify-center shrink-0 shadow-xs`}>
        <span className={`${size === "card" ? "text-2xl" : size === "sm" ? "text-xs" : "text-base"} font-black text-[#e50914] font-serif`}>N</span>
      </div>
    );
  }
  if (clean.includes("notion")) {
    return (
      <div className={`${size === "card" ? "w-12 h-12" : size === "sm" ? "w-5 h-5 rounded-md" : "w-10 h-10 rounded-xl"} rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs`}>
        <span className={`${size === "card" ? "text-xl" : size === "sm" ? "text-xs" : "text-base"} font-bold text-slate-900 font-serif`}>N</span>
      </div>
    );
  }
  if (clean.includes("github") || clean.includes("copilot")) {
    return (
      <div className={`${size === "card" ? "w-12 h-12" : size === "sm" ? "w-5 h-5 rounded-md" : "w-10 h-10 rounded-xl"} rounded-2xl bg-[#24292f] flex items-center justify-center shrink-0 shadow-xs text-white`}>
        <svg className={`${size === "card" ? "w-7 h-7" : size === "sm" ? "w-3 h-3" : "w-5 h-5"}`} viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      </div>
    );
  }
  // For all other web services (emerging, AI tools, etc.), use high-res Google S2 favicon service with authentic domain
  const domain = directUrl ? directUrl : `${clean}.com`;
  return <DynamicBrandIcon name={name} domain={domain} size={size} />;
}

// ── Main Dashboard Component ────────────────────────────────────────────────

export function DefusalDashboard({
  data: initialData,
  destination: initialDestination,
  initialTab = "overview",
  onReset,
}: DefusalDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const serviceParam = searchParams?.get("service")?.toLowerCase();
  const queryParam = searchParams?.get("q");
  const tabParam = searchParams?.get("tab") as SidebarTab | null;

  const resolvedInitialTab: SidebarTab =
    tabParam && ["overview", "find", "saved", "history"].includes(tabParam)
      ? tabParam
      : initialTab || "overview";

  const [sidebarTab, setSidebarTab] = useState<SidebarTab>(resolvedInitialTab);
  const [activeTab, setActiveTab] = useState<TabType>("search");
  const [inAppModalOpen, setInAppModalOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [isSearchingFigure, setIsSearchingFigure] = useState(false);
  const [searchCelebration, setSearchCelebration] = useState(false);
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [resolveError, setResolveError] = useState<{
    query: string;
    message: string;
    isFakeOrUnrecognized: boolean;
  } | null>(null);

  // Compute initial active service cleanly
  const initialActiveService: ServiceData = useMemo(() => {
    if (serviceParam && PRESET_SERVICES[serviceParam]) {
      return PRESET_SERVICES[serviceParam];
    }
    if (initialDestination) {
      return {
        id: initialDestination.id,
        name: initialDestination.providerName,
        actionTitle: initialDestination.actionType.replace(/_/g, " "),
        badgeText: "Destination found",
        trail: initialDestination.navigationPath.length > 0 ? initialDestination.navigationPath.map((s) => s.label) : ["Account Settings", "Billing", "Cancel"],
        verificationNote: initialDestination.verification.evidenceSummary || "Verified from official navigation",
        directUrl: initialDestination.targetUrl,
        category: "Service Provider",
        inAppSteps: initialDestination.navigationPath.map((s) => ({
          stepNumber: s.stepNumber,
          instruction: s.instruction,
          decoyWarning: s.decoyWarning,
        })),
        darkPatterns: initialDestination.darkPatternWarnings,
      };
    }
    return PRESET_SERVICES.google_cloud;
  }, [serviceParam, initialDestination]);

  const [selectedServiceId, setSelectedServiceId] = useState<string>(() => initialActiveService.id);
  const [activeService, setActiveService] = useState<ServiceData>(() => initialActiveService);
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    if (queryParam) return queryParam;
    if (serviceParam && PRESET_SERVICES[serviceParam]) {
      const p = PRESET_SERVICES[serviceParam];
      return `${p.name} — ${p.actionTitle.toLowerCase()}`;
    }
    // No service param — start with an empty search bar
    return "";
  });

  const [isMounted, setIsMounted] = useState(false);

  // Saved Routes State (Deterministic initial state to prevent SSR hydration mismatch)
  const [savedRoutes, setSavedRoutes] = useState<ServiceData[]>([
    PRESET_SERVICES.google_cloud,
    PRESET_SERVICES.aws,
  ]);

  // History State (Deterministic initial state to prevent SSR hydration mismatch)
  const [historyItems, setHistoryItems] = useState<Array<{ id: string; name: string; action: string; time: string; timestamp: number }>>([
    { id: "aws", name: "AWS", action: "Cancel subscription", time: "2 hours ago", timestamp: 1729750000000 },
    { id: "adobe", name: "Adobe", action: "Turn off auto-renewal", time: "5 hours ago", timestamp: 1729739000000 },
  ]);

  // Scanned Receipt Banner state (Deterministic initial state)
  const [scannedReceiptNotice, setScannedReceiptNotice] = useState<SubscriptionDefusalResponse | null>(() => {
    return initialData || null;
  });

  // Client-side hydration sync for localStorage and sessionStorage
  useEffect(() => {
    setIsMounted(true);
    try {
      const storedSaved = localStorage.getItem("canceltrap_saved_routes");
      if (storedSaved) {
        const parsed = JSON.parse(storedSaved);
        if (Array.isArray(parsed) && parsed.length > 0) setSavedRoutes(parsed);
      }
    } catch {}

    try {
      const storedHistory = localStorage.getItem("canceltrap_history");
      if (storedHistory) {
        const parsed = JSON.parse(storedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) setHistoryItems(parsed);
      }
    } catch {}

    if (!initialData) {
      try {
        const storedScan = sessionStorage.getItem("canceltrap_active_scan");
        if (storedScan) {
          setScannedReceiptNotice(JSON.parse(storedScan) as SubscriptionDefusalResponse);
        }
      } catch {}
    }
  }, [initialData]);

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const resolvedCacheRef = useRef<Record<string, ServiceData>>({});

  // Derived suggestions as search query changes (Eliminates setState inside an effect)
  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || activeTab === "url") {
      return [];
    }
    const q = searchQuery.toLowerCase().trim();
    const matches = DESTINATION_REGISTRY.filter((entry) => {
      return (
        entry.providerName.toLowerCase().includes(q) ||
        entry.id.toLowerCase().includes(q) ||
        entry.aliases.some((a) => a.toLowerCase().includes(q))
      );
    }).slice(0, 5);

    return matches.map((m) => ({
      id: m.id,
      name: m.providerName,
      domain: m.providerDomain,
      action: m.supportedActions[0]?.actionType.replace(/_/g, " ") || "manage subscription",
    }));
  }, [searchQuery, activeTab]);

  const recordHistory = useCallback((id: string, name: string, action: string) => {
    setHistoryItems((prev) => {
      const filtered = prev.filter((item) => item.name.toLowerCase() !== name.toLowerCase());
      const updated = [{ id, name, action, time: "Just now", timestamp: Date.now() }, ...filtered].slice(0, 15);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("canceltrap_history", JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  }, []);

  const loadCustomDestination = useCallback((dest: DestinationNode) => {
    setIsResolving(false);
    setResolveError(null);
    const isFree = Boolean(dest.isFreeService || dest.actionType === "zero_billing_free");
    const custom: ServiceData = {
      id: dest.id,
      name: dest.providerName,
      actionTitle: isFree
        ? "100% Free Software — Zero Recurring Billing"
        : dest.actionType.replace(/_/g, " "),
      badgeText: isFree
        ? "100% Free & Safe"
        : dest.verification?.status === "VERIFIED"
        ? "Destination found"
        : "AI-verified route",
      trail:
        dest.navigationPath.length > 0
          ? dest.navigationPath.map((s) => s.label)
          : isFree
          ? ["Official Software", "No Auto-Renewals", "No Billing Needed"]
          : ["Account Settings", "Billing", "Cancel"],
      verificationNote:
        dest.verification?.evidenceSummary ||
        (isFree
          ? "Verified free / open-source tool with zero recurring charges"
          : "Verified from official navigation"),
      directUrl: dest.targetUrl,
      category: dest.product || (isFree ? "Free Software & Non-Profit" : "Service Provider"),
      isFreeService: isFree,
      inAppSteps: dest.navigationPath.map((s) => ({
        stepNumber: s.stepNumber,
        instruction: s.instruction,
        decoyWarning: s.decoyWarning,
      })),
      darkPatterns: dest.darkPatternWarnings,
    };
    resolvedCacheRef.current[custom.id.toLowerCase()] = custom;
    resolvedCacheRef.current[custom.name.toLowerCase()] = custom;
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("canceltrap_resolved_cache", JSON.stringify(resolvedCacheRef.current));
      } catch {}
    }
    setSelectedServiceId(dest.id);
    setActiveService(custom);
    setSearchQuery(
      isFree
        ? `${dest.providerName} — 100% free (zero billing)`
        : `${dest.providerName} — ${dest.actionType.replace(/_/g, " ")}`
    );
    recordHistory(dest.id, dest.providerName, custom.actionTitle);
  }, [recordHistory]);

  const selectServiceById = useCallback((id: string) => {
    const key = id.toLowerCase();
    setSelectedServiceId(key);
    setIsResolving(false);
    setIsSearchingFigure(false);
    setSearchCelebration(false);
    setResolveError(null);

    // 1. Check in-memory & session resolved cache
    let item = resolvedCacheRef.current[key] || resolvedCacheRef.current[key.replace(/-gemini$/i, "")];
    if (!item && typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("canceltrap_resolved_cache");
        if (stored) {
          const parsed = JSON.parse(stored);
          resolvedCacheRef.current = { ...resolvedCacheRef.current, ...parsed };
          item = parsed[key] || parsed[key.replace(/-gemini$/i, "")];
        }
      } catch {}
    }
    if (item) {
      setActiveService(item);
      setSearchQuery(`${item.name} — ${item.actionTitle.toLowerCase()}`);
      recordHistory(item.id, item.name, item.actionTitle);
      return;
    }

    // 2. Preset services
    if (PRESET_SERVICES[key]) {
      const item = PRESET_SERVICES[key];
      setActiveService(item);
      setSearchQuery(`${item.name} — ${item.actionTitle.toLowerCase()}`);
      recordHistory(item.id, item.name, item.actionTitle);
      return;
    }

    // 3. Try resolving from registry
    const res = resolve(key);
    if (res.resolved && res.destination) {
      loadCustomDestination(res.destination);
    } else {
      // Look up registry entry
      const reg = DESTINATION_REGISTRY.find(
        (e) => e.id.toLowerCase() === key || e.aliases.some((a) => a.toLowerCase() === key)
      );
      if (reg) {
        const action = reg.supportedActions[0];
        const isFree = Boolean(reg.isFreeService || action?.actionType === "zero_billing_free");
        const newService: ServiceData = {
          id: reg.id,
          name: reg.providerName,
          actionTitle: isFree
            ? "100% Free Software — Zero Recurring Billing"
            : action
            ? action.actionType.replace(/_/g, " ")
            : "Manage subscription",
          badgeText: isFree ? "100% Free & Safe" : "Destination found",
          trail:
            action?.navigationPath?.map((p) => p.label) ||
            (isFree
              ? ["Official Software", "No Auto-Renewals", "No Billing Needed"]
              : ["Settings", "Billing", "Cancel"]),
          verificationNote: isFree
            ? "Verified free / open-source tool with zero recurring charges"
            : "Verified from official navigation",
          directUrl: action?.targetUrl || `https://${reg.providerDomain}`,
          category: reg.category,
          isFreeService: isFree,
          inAppSteps:
            action?.navigationPath?.map((p) => ({
              stepNumber: p.stepNumber,
              instruction: p.instruction,
              decoyWarning: p.decoyWarning,
            })) || [],
          darkPatterns: action?.darkPatternWarnings || [],
        };
        setActiveService(newService);
        setSearchQuery(
          isFree
            ? `${newService.name} — 100% free (zero billing)`
            : `${newService.name} — ${newService.actionTitle.toLowerCase()}`
        );
        recordHistory(newService.id, newService.name, newService.actionTitle);
      }
    }
  }, [loadCustomDestination, recordHistory]);

  const handleSearchQuery = useCallback(async (queryText: string) => {
    const q = queryText.toLowerCase().trim();
    if (!q) return;

    setResolveError(null);
    setActiveSearchTerm(queryText);
    setIsSearchingFigure(true);
    setSearchCelebration(false);

    const startTime = Date.now();
    const waitMinHuntAnimation = async () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < 1600) {
        await new Promise((r) => setTimeout(r, 1600 - elapsed));
      }
    };

    // 1. URL paste mode check
    if (activeTab === "url" || q.startsWith("http") || q.includes(".com") || q.includes(".dev") || q.includes(".org") || q.includes(".ai") || q.includes(".app")) {
      const res = resolve(q);
      if (res.resolved && res.destination) {
        await waitMinHuntAnimation();
        loadCustomDestination(res.destination);
        setIsSearchingFigure(true);
        setSearchCelebration(true);
        return;
      }
    }

    // 2. Fast registry check for instant presets
    if (q.includes("aws") || q.includes("amazon")) {
      await waitMinHuntAnimation();
      selectServiceById("aws");
      setIsSearchingFigure(true);
      setSearchCelebration(true);
      return;
    } else if (q.includes("adobe") || q.includes("photoshop") || q.includes("creative cloud")) {
      await waitMinHuntAnimation();
      selectServiceById("adobe");
      setIsSearchingFigure(true);
      setSearchCelebration(true);
      return;
    } else if (q.includes("microsoft") || q.includes("office") || q.includes("365")) {
      await waitMinHuntAnimation();
      selectServiceById("microsoft_365");
      setIsSearchingFigure(true);
      setSearchCelebration(true);
      return;
    } else if (q.includes("google") || q.includes("cloud") || q.includes("gcp") || q.includes("gemini")) {
      await waitMinHuntAnimation();
      selectServiceById("google_cloud");
      setIsSearchingFigure(true);
      setSearchCelebration(true);
      return;
    } else if (q.includes("lovable") || q.includes("gpt engineer")) {
      await waitMinHuntAnimation();
      selectServiceById("lovable");
      setIsSearchingFigure(true);
      setSearchCelebration(true);
      return;
    } else if (q.includes("openai") || q.includes("chatgpt")) {
      await waitMinHuntAnimation();
      selectServiceById("chatgpt");
      setIsSearchingFigure(true);
      setSearchCelebration(true);
      return;
    } else if (q.includes("figma")) {
      await waitMinHuntAnimation();
      selectServiceById("figma");
      setIsSearchingFigure(true);
      setSearchCelebration(true);
      return;
    }

    // 3. Fast deterministic resolver for all 50+ built-in registry services
    const localRes = resolve(q);
    if (localRes.resolved && localRes.destination) {
      await waitMinHuntAnimation();
      loadCustomDestination(localRes.destination);
      setIsSearchingFigure(true);
      setSearchCelebration(true);
      return;
    }

    // 4. Algorithmic + AI pipeline via /api/resolve (Gemini validation gate)
    setIsResolving(true);
    try {
      const resp = await fetch("/api/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText }),
      });

      const data = await resp.json();

      await waitMinHuntAnimation();

      if (data.resolved && data.destination) {
        loadCustomDestination(data.destination);
        setIsSearchingFigure(true);
        setSearchCelebration(true);
        setIsResolving(false);
        setResolveError(null);
      } else {
        // Detected as unverified, fictional, misspelled, or non-existent
        setIsResolving(false);
        setIsSearchingFigure(false);
        setSearchCelebration(false);
        setResolveError({
          query: queryText,
          message:
            data.error ||
            `Could not verify "${queryText}" as an active or recognized subscription service. In accordance with CancelTrap anti-hallucination protocols, no fabricated URLs or steps were generated.`,
          isFakeOrUnrecognized: true,
        });
      }
    } catch {
      await waitMinHuntAnimation();
      setIsResolving(false);
      setIsSearchingFigure(false);
      setSearchCelebration(false);
      setResolveError({
        query: queryText,
        message: `Network or service timeout while attempting to verify "${queryText}". Please check your connection and try again.`,
        isFakeOrUnrecognized: false,
      });
    } finally {
      setIsResolving(false);
    }
  }, [activeTab, loadCustomDestination, selectServiceById]);

  // Synchronize serviceParam when URL param changes (render-time pattern)
  const [prevServiceParam, setPrevServiceParam] = useState(serviceParam);
  if (serviceParam !== prevServiceParam) {
    setPrevServiceParam(serviceParam);
    if (serviceParam) {
      selectServiceById(serviceParam);
    }
  }

  // Synchronize initialDestination when prop changes (render-time pattern)
  const [prevDestinationId, setPrevDestinationId] = useState(initialDestination?.id);
  if (initialDestination?.id !== prevDestinationId) {
    setPrevDestinationId(initialDestination?.id);
    if (initialDestination) {
      loadCustomDestination(initialDestination);
    }
  }

  // Synchronize asynchronous search query in useEffect (proper place for async network fetches)
  useEffect(() => {
    if (queryParam) {
      handleSearchQuery(queryParam);
    }
  }, [queryParam, handleSearchQuery]);

  // Click outside listener for suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSaveRoute = (service: ServiceData) => {
    setSavedRoutes((prev) => {
      const exists = prev.some((s) => s.id === service.id || s.name.toLowerCase() === service.name.toLowerCase());
      let updated: ServiceData[];
      if (exists) {
        updated = prev.filter((s) => s.id !== service.id && s.name.toLowerCase() !== service.name.toLowerCase());
      } else {
        updated = [service, ...prev];
      }
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("canceltrap_saved_routes", JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  };

  const isRouteSaved = useMemo(() => {
    return savedRoutes.some((s) => s.id === activeService.id || s.name.toLowerCase() === activeService.name.toLowerCase());
  }, [savedRoutes, activeService]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    handleSearchQuery(searchQuery);
  };

  const handleOpenDestination = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // 1. Open the REAL application tab in the browser
    if (activeService.directUrl) {
      window.open(activeService.directUrl, "_blank", "noopener,noreferrer");
    }
    // 2. Also open the step-by-step guidance co-pilot window
    setInAppModalOpen(true);
  };

  const clearHistory = () => {
    setHistoryItems([]);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("canceltrap_history");
      } catch {}
    }
  };

  const dismissScannedNotice = () => {
    setScannedReceiptNotice(null);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("canceltrap_active_scan");
      } catch {}
    }
  };

  const activeDestinationNode: DestinationNode = useMemo(() => {
    return {
      id: activeService.id,
      providerName: activeService.name,
      providerDomain: `${activeService.id}.com`,
      actionType: "cancel_subscription",
      targetUrl: activeService.directUrl,
      requiresAuth: true,
      isModalOrInPage: true,
      navigationPath: activeService.inAppSteps.map((s) => ({
        stepNumber: s.stepNumber,
        label: `Step ${s.stepNumber}`,
        instruction: s.instruction,
        targetType: "button",
        decoyWarning: s.decoyWarning,
      })),
      darkPatternWarnings: activeService.darkPatterns || ["Disguised buttons", "Decoy retention offers"],
      verification: {
        status: "VERIFIED",
        confidenceScore: 98,
        evidenceSummary: activeService.verificationNote,
        lastVerifiedDate: "2026-10-23",
        verifiedBy: "registry",
      },
    };
  }, [activeService]);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#d4ecfd] via-[#e8f3fd] to-[#c7e5fd] flex text-[#0c1b38] antialiased overflow-x-hidden">
      {/* ─── Ambient Oceanic Water Backdrop Layer ─── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft caustics wallpaper from newhero.webp */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat opacity-25 mix-blend-multiply hero-ambient-breathe"
          style={{
            backgroundImage: "url('/newhero.webp')",
            backgroundPosition: "center top",
            backgroundSize: "cover",
          }}
        />

        {/* Ambient Azure & Sky Luminous Glows */}
        <div
          className="absolute -top-[10%] right-[10%] w-[600px] h-[600px] rounded-full blur-[110px] opacity-60 water-caustics-gleam"
          style={{
            background:
              "radial-gradient(circle, rgba(56, 189, 248, 0.42) 0%, rgba(14, 165, 233, 0.2) 50%, transparent 75%)",
          }}
        />
        <div
          className="absolute top-[40%] -left-[10%] w-[550px] h-[550px] rounded-full blur-[120px] opacity-45 water-caustics-gleam"
          style={{
            background:
              "radial-gradient(ellipse, rgba(186, 230, 253, 0.5) 0%, rgba(2, 132, 199, 0.16) 55%, transparent 80%)",
            animationDelay: "-4s",
          }}
        />
        <div
          className="absolute -bottom-[10%] right-[25%] w-[650px] h-[450px] rounded-full blur-[110px] opacity-50 water-caustics-gleam"
          style={{
            background:
              "radial-gradient(circle, rgba(14, 165, 233, 0.22) 0%, rgba(56, 189, 248, 0.14) 50%, transparent 75%)",
            animationDelay: "-6s",
          }}
        />

        {/* Interactive Poppable Floating Translucent Specular Water Orbs */}
        <PoppableWaterOrb
          id="dash-orb-1"
          sizeClass="w-13 h-13"
          positionClass="top-[18%] right-[8%]"
          orbFloatClass="water-orb-1"
          gradient="radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95) 0%, rgba(224,242,254,0.45) 35%, rgba(56,189,248,0.12) 75%, transparent 100%)"
          highlightClass="top-2 left-2 w-2.5 h-1.5 rounded-full bg-white/90 rotate-[-25deg] blur-[0.4px]"
        />

        <PoppableWaterOrb
          id="dash-orb-2"
          sizeClass="w-10 h-10"
          positionClass="top-[55%] right-[22%]"
          orbFloatClass="water-orb-2"
          gradient="radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9) 0%, rgba(186,230,253,0.4) 40%, rgba(14,165,233,0.1) 80%, transparent 100%)"
          highlightClass="top-1.5 left-1.5 w-2 h-1 rounded-full bg-white/85 rotate-[-20deg]"
        />

        <PoppableWaterOrb
          id="dash-orb-3"
          sizeClass="w-8 h-8"
          positionClass="bottom-[20%] left-[20%]"
          orbFloatClass="water-orb-3"
          gradient="radial-gradient(circle at 30% 30%, rgba(255,255,255,0.92) 0%, rgba(224,242,254,0.5) 45%, transparent 90%)"
        />

        <PoppableWaterOrb
          id="dash-orb-4"
          sizeClass="w-7 h-7"
          positionClass="top-[12%] right-[42%]"
          orbFloatClass="water-orb-1"
          gradient="radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85) 0%, rgba(186,230,253,0.3) 50%, transparent 100%)"
        />
      </div>

      {/* ─── Left Sidebar Navigation (Frosted Scotch Glass Panel) ─── */}
      <aside className="relative z-10 w-60 sm:w-64 shrink-0 border-r border-white/70 bg-white/55 backdrop-blur-2xl p-6 sm:p-8 flex flex-col justify-between select-none shadow-[4px_0_24px_rgba(20,70,160,0.03)]">
        <div className="space-y-6">
          {/* Brand Logo & Back to Home button */}
          <div className="flex items-center justify-between pb-3 border-b border-white/60">
            <button
              type="button"
              onClick={() => (onReset ? onReset() : router.push("/"))}
              className="inline-flex items-center gap-2 group cursor-pointer"
              title="CancelTrap Home"
            >
              <Image
                src="/canceltrap-logo.webp"
                alt="CancelTrap"
                width={130}
                height={32}
                priority
                className="h-6.5 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </button>
            <button
              type="button"
              onClick={() => (onReset ? onReset() : router.push("/"))}
              className="text-xs text-[#556987] hover:text-[#1658eb] font-semibold flex items-center gap-1 transition cursor-pointer"
              title="Return to Landing Page"
            >
              <span>← Home</span>
            </button>
          </div>

          <nav className="space-y-1.5">
            {/* Overview */}
            <button
              type="button"
              onClick={() => {
                setSidebarTab("overview");
                router.push("/dashboard");
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition cursor-pointer text-left ${
                sidebarTab === "overview"
                  ? "bg-white/85 text-[#1658eb] border border-white/90 shadow-[0_2px_12px_rgba(22,88,235,0.08),inset_0_1px_1px_rgba(255,255,255,1)]"
                  : "text-[#486284] hover:text-[#0c1b38] hover:bg-white/45"
              }`}
            >
              <Home className={`w-4 h-4 stroke-[2.2] ${sidebarTab === "overview" ? "text-[#1658eb]" : "text-[#556987]"}`} />
              <span>Overview</span>
            </button>

            {/* Find a destination */}
            <button
              type="button"
              onClick={() => {
                setSidebarTab("find");
                router.push("/find");
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition cursor-pointer text-left ${
                sidebarTab === "find"
                  ? "bg-white/85 text-[#1658eb] font-semibold border border-white/90 shadow-[0_2px_12px_rgba(22,88,235,0.08),inset_0_1px_1px_rgba(255,255,255,1)]"
                  : "text-[#486284] hover:text-[#0c1b38] hover:bg-white/45"
              }`}
            >
              <Search className={`w-4 h-4 stroke-[2.2] ${sidebarTab === "find" ? "text-[#1658eb]" : "text-[#556987]"}`} />
              <span>Find a destination</span>
            </button>

            {/* Saved routes */}
            <button
              type="button"
              onClick={() => {
                setSidebarTab("saved");
                router.push("/saved");
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition cursor-pointer text-left ${
                sidebarTab === "saved"
                  ? "bg-white/85 text-[#1658eb] font-semibold border border-white/90 shadow-[0_2px_12px_rgba(22,88,235,0.08),inset_0_1px_1px_rgba(255,255,255,1)]"
                  : "text-[#486284] hover:text-[#0c1b38] hover:bg-white/45"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Bookmark className={`w-4 h-4 stroke-[2.2] ${sidebarTab === "saved" ? "text-[#1658eb]" : "text-[#556987]"}`} />
                <span>Saved routes</span>
              </div>
              {isMounted && savedRoutes.length > 0 && (
                <span suppressHydrationWarning className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#1658eb]">
                  {savedRoutes.length}
                </span>
              )}
            </button>

            {/* History */}
            <button
              type="button"
              onClick={() => {
                setSidebarTab("history");
                router.push("/history");
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition cursor-pointer text-left ${
                sidebarTab === "history"
                  ? "bg-white/85 text-[#1658eb] font-semibold border border-white/90 shadow-[0_2px_12px_rgba(22,88,235,0.08),inset_0_1px_1px_rgba(255,255,255,1)]"
                  : "text-[#486284] hover:text-[#0c1b38] hover:bg-white/45"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Clock className={`w-4 h-4 stroke-[2.2] ${sidebarTab === "history" ? "text-[#1658eb]" : "text-[#556987]"}`} />
                <span>History</span>
              </div>
              {isMounted && historyItems.length > 0 && (
                <span suppressHydrationWarning className="text-[11px] font-semibold text-slate-400">
                  {historyItems.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer badge */}
        <div className="pt-6 border-t border-white/60 text-xs text-[#556987] flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-[#15a24a]" />
          <span>Active Defusal Shield</span>
        </div>
      </aside>

      {/* ─── Main Content Canvas ─── */}
      <main className="relative z-10 flex-1 py-10 px-8 sm:px-12 lg:px-16 max-w-5xl text-left">
        {/* ─── TAB 1: OVERVIEW ─── */}
        {sidebarTab === "overview" && (
          <>
            {/* Header Title */}
            <h1 className="text-3xl sm:text-[36px] font-bold text-[#0c1b38] font-display tracking-tight leading-tight">
              Find the right page.
            </h1>

            {/* Subtitle */}
            <p className="text-sm text-[#486284] mt-1.5 font-normal leading-relaxed">
              Search for a service or paste a link to get to the exact place to manage it.
            </p>

            {/* Tab Toggle Row (Scotch Glass Pills) */}
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("search");
                  if (searchQuery.startsWith("http")) setSearchQuery("Google Cloud — cancel a subscription");
                }}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
                  activeTab === "search"
                    ? "bg-white/90 border border-white text-[#1658eb] shadow-[0_4px_16px_rgba(22,88,235,0.12),inset_0_1px_2px_rgba(255,255,255,1)] backdrop-blur-xl"
                    : "bg-white/55 border border-white/80 text-[#556987] hover:text-[#0c1b38] hover:bg-white/75 backdrop-blur-md shadow-[0_2px_8px_rgba(20,70,160,0.04)]"
                }`}
              >
                <Search className="w-4 h-4 text-[#1658eb]" />
                <span>Search service</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("url");
                  setSearchQuery("");
                }}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-2 transition cursor-pointer ${
                  activeTab === "url"
                    ? "bg-white/90 border border-white text-[#1658eb] font-semibold shadow-[0_4px_16px_rgba(22,88,235,0.12),inset_0_1px_2px_rgba(255,255,255,1)] backdrop-blur-xl"
                    : "bg-white/55 border border-white/80 text-[#556987] hover:text-[#0c1b38] hover:bg-white/75 backdrop-blur-md shadow-[0_2px_8px_rgba(20,70,160,0.04)]"
                }`}
              >
                <Link2 className="w-4 h-4 text-[#556987]" />
                <span>Paste a URL</span>
              </button>
            </div>

            {/* Search Input Box with Scotch Glass Aesthetics */}
            <div ref={searchBoxRef} className="relative mt-5">
              <form onSubmit={handleSearchSubmit}>
                <div className="bg-white/85 backdrop-blur-2xl rounded-2xl border border-white/95 p-1.5 pl-5 flex items-center gap-3 shadow-[0_8px_32px_rgba(20,70,160,0.08),inset_0_1px_2px_rgba(255,255,255,1)] focus-within:border-sky-400 focus-within:shadow-[0_12px_36px_rgba(22,88,235,0.14),inset_0_1px_2px_rgba(255,255,255,1)] transition-all">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => {
                      if (suggestions.length > 0) setShowSuggestions(true);
                    }}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    placeholder={
                      activeTab === "url"
                        ? "Paste any subscription or billing URL here..."
                        : "e.g. Google Cloud — cancel a subscription"
                    }
                    className="w-full bg-transparent outline-none text-sm sm:text-base text-[#0c1b38] placeholder:text-slate-400 font-normal"
                  />
                  <button
                    type="submit"
                    disabled={isResolving}
                    className="bg-[#1658eb] hover:bg-[#1246c4] text-white px-6 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 shrink-0 cursor-pointer shadow-xs active:scale-98 transition disabled:opacity-80 disabled:cursor-not-allowed"
                  >
                    {isResolving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Find destination</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Suggestions Floating Dropdown (Scotch Glass) */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-2xl rounded-2xl border border-white shadow-[0_20px_50px_rgba(20,70,160,0.15)] overflow-hidden z-30 divide-y divide-sky-100/50 animate-in fade-in-50 zoom-in-95 duration-150">
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        selectServiceById(item.id);
                        setShowSuggestions(false);
                      }}
                      className="p-3.5 px-5 flex items-center justify-between hover:bg-sky-50/60 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-white border border-sky-100 flex items-center justify-center shrink-0 shadow-2xs">
                          {renderServiceIcon(item.id, item.name, "sm", item.domain)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-[#0c1b38]">{item.name}</span>
                            {item.domain && (
                              <span className="text-[10px] font-mono bg-blue-50 text-[#1658eb] px-1.5 py-0.5 rounded-md border border-blue-100 font-medium">
                                {item.domain}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 capitalize">({item.action})</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#1658eb] flex items-center gap-1">
                        Select <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Popular Filter Chips (Scotch Frosted Glass Pills) */}
            <div className="flex items-center gap-3 mt-6 flex-wrap text-sm">
              <span className="text-slate-500 font-medium text-sm mr-1">Popular</span>

              {/* AWS Chip */}
              <button
                type="button"
                onClick={() => selectServiceById("aws")}
                className={`px-4 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                  selectedServiceId === "aws"
                    ? "bg-white/90 border-sky-300 text-[#1658eb] shadow-[0_2px_8px_rgba(22,88,235,0.12),inset_0_1px_1px_rgba(255,255,255,1)] backdrop-blur-xl"
                    : "bg-white/65 hover:bg-white/85 border-white/80 text-[#0c1b38] hover:border-sky-300/80 shadow-[0_2px_8px_rgba(20,70,160,0.04)] backdrop-blur-md"
                }`}
              >
                <AwsChipIcon />
                <span>AWS</span>
              </button>

              {/* Google Cloud Chip */}
              <button
                type="button"
                onClick={() => selectServiceById("google_cloud")}
                className={`px-4 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                  selectedServiceId === "google_cloud"
                    ? "bg-white/90 border-sky-300 text-[#1658eb] shadow-[0_2px_8px_rgba(22,88,235,0.12),inset_0_1px_1px_rgba(255,255,255,1)] backdrop-blur-xl"
                    : "bg-white/65 hover:bg-white/85 border-white/80 text-[#0c1b38] hover:border-sky-300/80 shadow-[0_2px_8px_rgba(20,70,160,0.04)] backdrop-blur-md"
                }`}
              >
                <GoogleCloudIcon className="w-4 h-4" />
                <span>Google Cloud</span>
              </button>

              {/* Adobe Chip */}
              <button
                type="button"
                onClick={() => selectServiceById("adobe")}
                className={`px-4 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                  selectedServiceId === "adobe"
                    ? "bg-white/90 border-sky-300 text-[#1658eb] shadow-[0_2px_8px_rgba(22,88,235,0.12),inset_0_1px_1px_rgba(255,255,255,1)] backdrop-blur-xl"
                    : "bg-white/65 hover:bg-white/85 border-white/80 text-[#0c1b38] hover:border-sky-300/80 shadow-[0_2px_8px_rgba(20,70,160,0.04)] backdrop-blur-md"
                }`}
              >
                <AdobeChipIcon />
                <span>Adobe</span>
              </button>

              {/* Microsoft 365 Chip */}
              <button
                type="button"
                onClick={() => selectServiceById("microsoft_365")}
                className={`px-4 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                  selectedServiceId === "microsoft_365"
                    ? "bg-white/90 border-sky-300 text-[#1658eb] shadow-[0_2px_8px_rgba(22,88,235,0.12),inset_0_1px_1px_rgba(255,255,255,1)] backdrop-blur-xl"
                    : "bg-white/65 hover:bg-white/85 border-white/80 text-[#0c1b38] hover:border-sky-300/80 shadow-[0_2px_8px_rgba(20,70,160,0.04)] backdrop-blur-md"
                }`}
              >
                <Microsoft365ChipIcon />
                <span>Microsoft 365</span>
              </button>

              {/* ChatGPT Chip */}
              <button
                type="button"
                onClick={() => selectServiceById("chatgpt")}
                className={`px-4 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                  selectedServiceId === "chatgpt" || selectedServiceId === "openai"
                    ? "bg-white/90 border-sky-300 text-[#1658eb] shadow-[0_2px_8px_rgba(22,88,235,0.12),inset_0_1px_1px_rgba(255,255,255,1)] backdrop-blur-xl"
                    : "bg-white/65 hover:bg-white/85 border-white/80 text-[#0c1b38] hover:border-sky-300/80 shadow-[0_2px_8px_rgba(20,70,160,0.04)] backdrop-blur-md"
                }`}
              >
                <ChatGptChipIcon />
                <span>ChatGPT</span>
              </button>

              {/* Lovable Chip */}
              <button
                type="button"
                onClick={() => selectServiceById("lovable")}
                className={`px-4 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                  selectedServiceId === "lovable"
                    ? "bg-white/90 border-sky-300 text-[#1658eb] shadow-[0_2px_8px_rgba(22,88,235,0.12),inset_0_1px_1px_rgba(255,255,255,1)] backdrop-blur-xl"
                    : "bg-white/65 hover:bg-white/85 border-white/80 text-[#0c1b38] hover:border-sky-300/80 shadow-[0_2px_8px_rgba(20,70,160,0.04)] backdrop-blur-md"
                }`}
              >
                <LovableChipIcon />
                <span>Lovable</span>
              </button>

              {/* Figma Chip */}
              <button
                type="button"
                onClick={() => selectServiceById("figma")}
                className={`px-4 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                  selectedServiceId === "figma"
                    ? "bg-white/90 border-sky-300 text-[#1658eb] shadow-[0_2px_8px_rgba(22,88,235,0.12),inset_0_1px_1px_rgba(255,255,255,1)] backdrop-blur-xl"
                    : "bg-white/65 hover:bg-white/85 border-white/80 text-[#0c1b38] hover:border-sky-300/80 shadow-[0_2px_8px_rgba(20,70,160,0.04)] backdrop-blur-md"
                }`}
              >
                <FigmaChipIcon />
                <span>Figma</span>
              </button>

              {/* Wikipedia Chip (Free Non-Profit) */}
              <button
                type="button"
                onClick={() => selectServiceById("wikipedia")}
                className={`px-4 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                  selectedServiceId === "wikipedia"
                    ? "bg-white/90 border-sky-300 text-[#1658eb] shadow-[0_2px_8px_rgba(22,88,235,0.12),inset_0_1px_1px_rgba(255,255,255,1)] backdrop-blur-xl"
                    : "bg-white/65 hover:bg-white/85 border-white/80 text-[#0c1b38] hover:border-emerald-300 shadow-[0_2px_8px_rgba(20,70,160,0.04)] backdrop-blur-md"
                }`}
              >
                <span className="font-serif font-black text-xs text-slate-800">W</span>
                <span>Wikipedia</span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">Free</span>
              </button>

              {/* Blender Chip (Free Open-Source) */}
              <button
                type="button"
                onClick={() => selectServiceById("blender")}
                className={`px-4 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                  selectedServiceId === "blender"
                    ? "bg-white/90 border-sky-300 text-[#1658eb] shadow-[0_2px_8px_rgba(22,88,235,0.12),inset_0_1px_1px_rgba(255,255,255,1)] backdrop-blur-xl"
                    : "bg-white/65 hover:bg-white/85 border-white/80 text-[#0c1b38] hover:border-orange-300 shadow-[0_2px_8px_rgba(20,70,160,0.04)] backdrop-blur-md"
                }`}
              >
                <span className="font-bold text-xs text-orange-600">❖</span>
                <span>Blender</span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">Free</span>
              </button>
            </div>

            {/* ─── Active Destination Card / Stick Anger Searcher / Unrecognized State ─── */}
            {isSearchingFigure || isResolving || searchCelebration ? (
              <div className="mt-7">
                <StickAngerSearcher
                  query={activeSearchTerm || searchQuery}
                  isSearching={!searchCelebration}
                  isFound={searchCelebration}
                  onAnimationComplete={() => {
                    setIsSearchingFigure(false);
                    setSearchCelebration(false);
                  }}
                />
              </div>
            ) : resolveError ? (
              <div className="mt-7 bg-white/85 backdrop-blur-2xl rounded-3xl border border-rose-200/90 p-6 sm:p-7 shadow-[0_16px_48px_rgba(225,29,72,0.08),inset_0_1px_3px_rgba(255,255,255,1)] flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6 text-rose-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-xl font-bold text-[#0c1b38] font-display">
                        Unrecognized or Non-Existent Service
                      </h3>
                      <span className="px-3 py-0.5 rounded-full bg-rose-50 border border-rose-300 text-rose-700 font-semibold text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>Unverified Entity</span>
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {resolveError.message}
                    </p>
                    <div className="mt-3.5 p-3 rounded-xl bg-white/60 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        <strong className="text-slate-700 font-medium">Anti-Hallucination Safe-Guard Active:</strong> CancelTrap refused to fabricate a fake URL or bogus steps for this non-existent or unverified entity.
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 flex-wrap text-xs">
                      <span className="text-slate-400 font-medium">Try a verified service:</span>
                      {["Spotify", "Netflix", "Adobe", "ChatGPT", "Lovable", "AWS", "Wikipedia"].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setResolveError(null);
                            setSearchQuery(s);
                            handleSearchQuery(s);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/70 hover:bg-white text-slate-700 font-medium transition cursor-pointer border border-white/80"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-7 bg-white/85 backdrop-blur-2xl rounded-3xl border border-white/95 p-6 sm:p-7 shadow-[0_16px_48px_rgba(20,70,160,0.08),inset_0_1px_3px_rgba(255,255,255,1)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 card-hover-lift">
                <div className="flex items-start gap-4">
                  {/* Dynamic Brand Logo */}
                  {renderServiceIcon(activeService.id, activeService.name, "card", activeService.directUrl)}

                  <div>
                    {/* Header Line with Destination Found Badge & Bookmark Toggle */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-xl font-bold text-[#0c1b38] font-display">
                        {activeService.name}
                      </h3>
                      {activeService.directUrl && (
                        <span className="text-[11px] font-mono bg-white/80 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-medium">
                          {(() => {
                            try { return new URL(activeService.directUrl).hostname; } catch { return activeService.directUrl; }
                          })()}
                        </span>
                      )}
                      <span className={`px-3 py-0.5 rounded-full border font-semibold text-xs flex items-center gap-1.5 ${
                        activeService.isFreeService
                          ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                          : "bg-[#e8f7ee] border-[#a7e8be] text-[#0f8b3c]"
                      }`}>
                        {activeService.isFreeService ? (
                          <Shield className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 fill-[#0f8b3c] text-white" />
                        )}
                        <span>{activeService.badgeText}</span>
                      </span>

                      {/* Bookmark Save Button */}
                      <button
                        type="button"
                        onClick={() => toggleSaveRoute(activeService)}
                        className={`p-1.5 rounded-lg border transition cursor-pointer ${
                          isRouteSaved
                            ? "bg-amber-50 border-amber-300 text-amber-500"
                            : "bg-white/70 border-white/90 text-slate-400 hover:text-amber-500"
                        }`}
                        title={isRouteSaved ? "Saved in routes" : "Save this route"}
                      >
                        <Star className={`w-3.5 h-3.5 ${isRouteSaved ? "fill-amber-400" : ""}`} />
                      </button>
                    </div>

                    {/* Subtitle */}
                    <p className="text-sm text-[#486284] mt-1 font-normal capitalize">
                      {activeService.actionTitle}
                    </p>

                    {/* Reassurance Tag for Zero-Billing Free Software or Zimbabwe EcoAI */}
                    {activeService.isFreeService ? (
                      <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                        <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>🛡️ Zero Recurring Billing • $0.00 / Free Forever • No Subscription Trap</span>
                      </div>
                    ) : activeService.name.toLowerCase().includes("zimbabwe") ? (
                      <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
                        <span>🇿🇼 Econet Wireless Zimbabwe</span>
                        <span className="text-amber-400">•</span>
                        <span>USSD *449# / ecoaitoken.co.zw</span>
                      </div>
                    ) : null}

                    {/* Institutional Verified Defusal Path Stepper */}
                    <div className="mt-4 flex items-center flex-wrap gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none shrink-0 mr-0.5">
                        Defusal Path:
                      </span>
                      {activeService.trail.map((item, idx) => {
                        const isFirst = idx === 0;
                        const isLast = idx === activeService.trail.length - 1;
                        return (
                          <React.Fragment key={idx}>
                            <div
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold shadow-2xs transition ${
                                isLast
                                  ? "bg-gradient-to-r from-[#1658eb] to-[#0f4bc9] text-white shadow-xs"
                                  : isFirst
                                  ? "bg-white/95 border border-slate-200 text-[#0c1b38] font-mono text-[11px]"
                                  : "bg-white/85 border border-sky-200/80 text-[#1658eb]"
                              }`}
                            >
                              <span className={`text-[10px] font-bold ${isLast ? "text-blue-200" : "text-slate-400"}`}>
                                {idx + 1}.
                              </span>
                              <span className="whitespace-nowrap">{item}</span>
                            </div>
                            {idx < activeService.trail.length - 1 && (
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 stroke-[2.5]" />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {/* Verified Official Portal Seal */}
                    <div className="mt-3.5 flex items-center gap-2 flex-wrap">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200/90 text-emerald-800 text-[11px] font-semibold shadow-2xs">
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.8]" />
                        <span>Verified Official Portal</span>
                      </div>
                      <span className="text-[11px] text-[#556987] font-medium">• {activeService.verificationNote}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons: Direct Real Tab + Co-Pilot */}
                {activeService.isFreeService ? (
                  <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
                    <a
                      href={activeService.directUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4.5 py-2.5 rounded-xl bg-white/90 hover:bg-white text-emerald-800 border border-emerald-200 font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs hover:shadow-xs active:scale-95 transition cursor-pointer"
                      title={`Visit official ${activeService.name} website`}
                    >
                      <span>Visit official site</span>
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                    </a>

                    <button
                      type="button"
                      onClick={handleOpenDestination}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-[0_4px_14px_rgba(16,185,129,0.25)] active:scale-98 transition flex items-center gap-2 shrink-0 cursor-pointer"
                      title="View software safety & usage guidelines"
                    >
                      <span>View safety guide</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
                    <a
                      href={activeService.directUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4.5 py-2.5 rounded-xl bg-white/90 hover:bg-white text-[#1658eb] border border-sky-200/90 hover:border-sky-300 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-2xs hover:shadow-xs active:scale-98 transition cursor-pointer"
                      title={`Open real ${activeService.name} portal in a new browser tab`}
                    >
                      <span>Open real tab</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#1658eb]" />
                    </a>

                    <button
                      type="button"
                      onClick={handleOpenDestination}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1658eb] to-[#0f4bc9] hover:from-[#1246c4] hover:to-[#0d3ea6] text-white font-semibold text-xs sm:text-sm shadow-[0_4px_14px_rgba(22,88,235,0.25)] hover:shadow-[0_6px_20px_rgba(22,88,235,0.32)] active:scale-98 transition flex items-center gap-2 shrink-0 cursor-pointer"
                      title="Open real tab & launch CancelTrap step-by-step Co-Pilot"
                    >
                      <span>Open destination</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ─── Recent Searches Section (Scotch Glass Box) ─── */}
            <section className="mt-10">
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="text-lg font-bold text-[#0c1b38] font-display">
                  Recent searches
                </h3>
                {historyItems.length > 0 && (
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="text-xs text-slate-400 hover:text-red-500 font-medium transition cursor-pointer"
                  >
                    Clear history
                  </button>
                )}
              </div>

              <div className="bg-white/85 backdrop-blur-2xl rounded-2xl border border-white/95 shadow-[0_12px_40px_rgba(20,70,160,0.07),inset_0_1px_2px_rgba(255,255,255,1)] overflow-hidden divide-y divide-sky-100/40">
                {historyItems.slice(0, 4).map((item) => (
                  <div
                    key={`${item.id}-${item.timestamp}`}
                    onClick={() => selectServiceById(item.id)}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-white/60 transition group"
                  >
                    <div className="flex items-center gap-3.5">
                      {renderServiceIcon(item.id, item.name, "row")}
                      <div>
                        <h4 className="text-sm font-bold text-[#0c1b38] group-hover:text-[#1658eb] transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-xs text-[#556987] mt-0.5 capitalize">
                          {item.action}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{item.time}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-[#1658eb] transition" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ─── TAB 2: FIND A DESTINATION ─── */}
        {sidebarTab === "find" && (
          <div className="space-y-6 animate-in fade-in-50">
            <div>
              <h1 className="text-3xl font-bold text-[#0c1b38] font-display">
                Destination Directory
              </h1>
              <p className="text-sm text-[#486284] mt-1">
                Browse verified cancellation portals across major cloud providers, AI platforms, and SaaS products.
              </p>
            </div>

            {/* Quick Search */}
            <div className="bg-white/85 backdrop-blur-2xl rounded-2xl border border-white/95 p-2 pl-4 flex items-center gap-3 shadow-[0_8px_32px_rgba(20,70,160,0.06),inset_0_1px_2px_rgba(255,255,255,1)]">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search any platform (e.g. Spotify, Lovable, Netflix, GitHub)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => handleSearchQuery(searchQuery)}
                className="bg-[#1658eb] hover:bg-[#1246c4] text-white px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
              >
                Search
              </button>
            </div>

            {/* Category Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {Object.values(PRESET_SERVICES).map((service) => (
                <div
                  key={service.id}
                  onClick={() => {
                    setActiveService(service);
                    setSelectedServiceId(service.id);
                    setSidebarTab("overview");
                  }}
                  className="p-5 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/90 hover:border-sky-400 hover:bg-white/90 hover:shadow-[0_12px_36px_rgba(20,70,160,0.12)] transition cursor-pointer group flex items-start gap-4 shadow-[0_6px_20px_rgba(20,70,160,0.04),inset_0_1px_1px_rgba(255,255,255,1)]"
                >
                  {renderServiceIcon(service.id, service.name, "row")}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-[#0c1b38] group-hover:text-[#1658eb] transition">
                        {service.name}
                      </h4>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-[#556987] mt-1">{service.actionTitle}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs text-[#1658eb] font-semibold">
                      <span>View route</span>
                      <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 3: SAVED ROUTES ─── */}
        {sidebarTab === "saved" && (
          <div className="space-y-6 animate-in fade-in-50">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#0c1b38] font-display">
                  Saved Routes
                </h1>
                <p className="text-sm text-[#486284] mt-1">
                  Quick access to bookmarked cancellation paths for fast defusal.
                </p>
              </div>
              <span suppressHydrationWarning className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-[#1658eb] border border-blue-200">
                {savedRoutes.length} Bookmarked
              </span>
            </div>

            {savedRoutes.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/95 text-slate-400 shadow-[0_12px_40px_rgba(20,70,160,0.06),inset_0_1px_2px_rgba(255,255,255,1)]">
                <Bookmark className="w-10 h-10 mx-auto mb-3 text-slate-300 stroke-1" />
                <h3 className="font-bold text-[#0c1b38] text-base">No saved routes yet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Click the star icon on any destination card to save it for immediate access.
                </p>
                <button
                  type="button"
                  onClick={() => setSidebarTab("overview")}
                  className="mt-4 px-5 py-2 rounded-full bg-[#1658eb] text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Browse Overview
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedRoutes.map((route) => (
                  <div
                    key={route.id}
                    className="p-5 rounded-2xl bg-white/80 backdrop-blur-2xl border border-white/95 shadow-[0_10px_32px_rgba(20,70,160,0.06),inset_0_1px_2px_rgba(255,255,255,1)] flex items-center justify-between gap-4 card-hover-lift"
                  >
                    <div className="flex items-center gap-4">
                      {renderServiceIcon(route.id, route.name, "row")}
                      <div>
                        <h4 className="font-bold text-sm text-[#0c1b38]">{route.name}</h4>
                        <p className="text-xs text-[#556987] mt-0.5">{route.actionTitle}</p>
                        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#1658eb]">
                          {route.trail.map((t, idx) => (
                            <React.Fragment key={idx}>
                              <span>{t}</span>
                              {idx < route.trail.length - 1 && <span className="text-slate-300">/</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveService(route);
                          setSelectedServiceId(route.id);
                          setInAppModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#1658eb] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#1246c4] cursor-pointer shadow-xs"
                      >
                        <span>Open destination</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSaveRoute(route)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 4: HISTORY ─── */}
        {sidebarTab === "history" && (
          <div className="space-y-6 animate-in fade-in-50">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#0c1b38] font-display">
                  Defusal Audit History
                </h1>
                <p className="text-sm text-[#486284] mt-1">
                  Chronological record of all subscription scans and verified path resolutions.
                </p>
              </div>
              {historyItems.length > 0 && (
                <button
                  type="button"
                  onClick={clearHistory}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                >
                  Clear all history
                </button>
              )}
            </div>

            {historyItems.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/95 text-slate-400 shadow-[0_12px_40px_rgba(20,70,160,0.06),inset_0_1px_2px_rgba(255,255,255,1)]">
                <Clock className="w-10 h-10 mx-auto mb-3 text-slate-300 stroke-1" />
                <h3 className="font-bold text-[#0c1b38] text-base">No history recorded</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Searches and resolved destinations will automatically appear here.
                </p>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-2xl rounded-2xl border border-white/95 divide-y divide-sky-100/40 shadow-[0_12px_40px_rgba(20,70,160,0.07),inset_0_1px_2px_rgba(255,255,255,1)] overflow-hidden">
                {historyItems.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    onClick={() => {
                      selectServiceById(item.id);
                      setSidebarTab("overview");
                    }}
                    className="p-4 sm:p-5 flex items-center justify-between hover:bg-white/60 cursor-pointer transition group"
                  >
                    <div className="flex items-center gap-3.5">
                      {renderServiceIcon(item.id, item.name, "row")}
                      <div>
                        <h4 className="text-sm font-bold text-[#0c1b38] group-hover:text-[#1658eb] transition">
                          {item.name}
                        </h4>
                        <p className="text-xs text-[#556987] mt-0.5 capitalize">{item.action}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{item.time}</span>
                      <span className="font-semibold text-[#1658eb] opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                        Re-open <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ─── Integrated Live Defusal In-App Guided Window ─── */}
      {inAppModalOpen && (
        <InAppDefusalWindow
          destination={activeDestinationNode}
          isOpen={inAppModalOpen}
          onClose={() => setInAppModalOpen(false)}
          onMarkCanceled={() => setInAppModalOpen(false)}
          onDownloadIcs={() => {}}
          isCanceled={false}
        />
      )}
    </div>
  );
}
