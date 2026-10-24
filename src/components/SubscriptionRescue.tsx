"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Check,
  Clock,
  Sparkles,
  RotateCcw,
  Lock,
  Building2,
  DollarSign,
  AlertTriangle,
  TrendingDown,
  Compass,
  Maximize2,
  ArrowRight,
  Copy,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Scale,
  Eye,
} from "lucide-react";
import { SubscriptionDefusalResponse } from "@/lib/types";
import type { DestinationNode } from "@/lib/engine/types";
import { downloadKillSwitchIcs } from "@/lib/calendar";
import { InAppDefusalWindow } from "./InAppDefusalWindow";

interface SubscriptionRescueProps {
  data?: SubscriptionDefusalResponse | null;
  destination?: DestinationNode | null;
  onReset: () => void;
}

export function SubscriptionRescue({ data, destination, onReset }: SubscriptionRescueProps) {
  const merchantName = destination?.providerName || data?.merchant?.name || "Subscription Service";
  const category = destination?.product || data?.merchant?.category || "Cloud & Software Service";
  const rawPortalUrl = destination?.targetUrl || data?.merchant?.directPortalUrl || "";
  const confidence = destination?.verification?.confidenceScore || 98;
  const verifiedStatus = destination?.verification?.status || "VERIFIED";

  const [portalOpened, setPortalOpened] = useState(false);
  const [markedCanceled, setMarkedCanceled] = useState(false);
  const [reminderAdded, setReminderAdded] = useState(false);
  const [isInAppWindowOpen, setIsInAppWindowOpen] = useState(false);
  const [activeStepInModal, setActiveStepInModal] = useState<number>(0);

  // Bleed Calculator Timeframe state
  const [timeframeYears, setTimeframeYears] = useState<number>(5);

  // Dark pattern X-Ray active tab
  const [selectedTrapTab, setSelectedTrapTab] = useState<number>(0);

  // Legal Notice Accordion & Copy state
  const [isLegalNoticeOpen, setIsLegalNoticeOpen] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);

  // Interactive step completion checkboxes in Section 3
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const amount = Number(data?.billing?.amount ?? 25.0);
  const currency = data?.billing?.currency ?? "$";
  const billingCycle = data?.billing?.billingCycle ?? "monthly";
  const days = data?.billing?.daysUntilRenewal ?? 3;

  // Dynamic calculated savings based on selected timeframe
  const calculatedBleed = amount * (billingCycle === "annual" ? timeframeYears : timeframeYears * 12);

  const patternType = destination?.actionType 
    ? (destination.actionType === "cancel_subscription" ? "Hidden Subscriptions Route" : "Disguised Action Path")
    : (data?.darkPattern?.patternType || "Hidden Cancellation Process");
  const patternSummary = destination?.darkPatternWarnings?.[0] || data?.darkPattern?.summary || "Direct cancellation is hidden behind several submenus.";

  const navigationSteps = destination?.navigationPath && destination.navigationPath.length > 0
    ? destination.navigationPath.map((s) => ({
        stepNumber: s.stepNumber,
        instruction: s.instruction,
        decoyWarning: s.decoyWarning,
      }))
    : data?.defusalChecklist && data.defusalChecklist.length > 0
    ? data.defusalChecklist
    : [
        {
          stepNumber: 1,
          instruction: `Navigate to ${merchantName} billing settings.`,
          decoyWarning: "Avoid clicking payment method updates or invoices.",
        },
        {
          stepNumber: 2,
          instruction: "Locate active plan and select cancellation or downgrade.",
          decoyWarning: "Ignore pause or downgrade discount traps.",
        },
        {
          stepNumber: 3,
          instruction: "Confirm permanent termination.",
          decoyWarning: "Ensure auto-renewal is officially stopped.",
        },
      ];

  // Clean URL helper
  const getCleanPortalUrl = () => {
    const raw = rawPortalUrl.trim();
    if (raw && (raw.startsWith("http://") || raw.startsWith("https://"))) {
      return raw;
    }
    if (raw && raw.includes(".")) {
      return `https://${raw}`;
    }
    return `https://${merchantName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com/account/billing`;
  };

  const portalHostname = (() => {
    try {
      const url = new URL(getCleanPortalUrl());
      return url.hostname + (url.pathname.length > 1 ? url.pathname : "");
    } catch {
      return rawPortalUrl || "cancellation page";
    }
  })();

  const handleOpenPortal = (targetStep = 0) => {
    setActiveStepInModal(targetStep);
    setIsInAppWindowOpen(true);
    setPortalOpened(true);
  };

  const handleDownloadIcs = () => {
    const safeKillSwitch = {
      eventTitle:
        data?.killSwitch?.eventTitle ||
        `Reminder: Cancel ${merchantName}`,
      suggestedAlertDate:
        data?.killSwitch?.suggestedAlertDate ||
        new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      alertMinutesBefore: data?.killSwitch?.alertMinutesBefore || 120,
      eventDescription:
        data?.killSwitch?.eventDescription ||
        `Reminder to cancel ${merchantName} before auto-renewal. Direct cancellation link: ${getCleanPortalUrl()}`,
    };

    const cleanFilename = `cancel-${merchantName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")}-reminder.ics`;

    try {
      downloadKillSwitchIcs(safeKillSwitch, cleanFilename);
    } catch (e) {
      console.warn("ICS download issue:", e);
    }
    setReminderAdded(true);
  };

  // Format alert date in plain English
  const formatAlertDate = (dateStr?: string) => {
    if (!dateStr) return "2 days before renewal";
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });
  };

  // FTC Legal Notice generator
  const generatedLegalNotice = `FORMAL NOTICE OF SUBSCRIPTION CANCELLATION & REVOCATION OF BILLING CONSENT
Pursuant to FTC 16 CFR Part 425 (Rule on Negative Option Plans & "Click-to-Cancel")

Date: ${new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
Service Provider: ${merchantName}
Subject: Unconditional Termination of Recurring Subscription & Auto-Renewal

To Customer Billing & Legal Support:

Please take notice that I hereby immediately cancel and terminate any and all subscriptions, recurring memberships, and auto-renewing agreements associated with my account for ${merchantName}.

Under 16 CFR Part 425 (the Federal Trade Commission's Click-to-Cancel Rule), consumers must be provided an easy, unhindered mechanism to cancel equal to the sign-up flow. Any retention decoys, early termination penalties without upfront disclosure, or unauthorized recurring charges will be formally reported to the FTC, CFPB, and card issuer as unauthorized transactions.

Please confirm cancellation in writing and issue zero subsequent charges to my payment method.

Account Identifier: [Your Registered Email / Account ID]
Status: CANCELED BY CONSUMER`;

  const handleCopyLegalNotice = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(generatedLegalNotice);
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 3000);
    }
  };

  const toggleStepCheckbox = (stepNum: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNum]: !prev[stepNum],
    }));
  };

  // Curated Dark Pattern X-Ray details for deep insight
  const trapDeconstructions = [
    {
      title: "Roach Motel Navigation",
      badge: "Obstacle Course",
      trap: "Signing up took 1 click. Canceling is buried 4 levels deep behind secondary billing menus.",
      solution: "CancelTrap bypasses the maze and lands you directly on the unadvertised cancel endpoint.",
    },
    {
      title: "Retention Decoy Offers",
      badge: "Emotional Decoy",
      trap: "Popups offer '50% off for 1 month' or 'Pause plan' to trick you into remaining on active auto-renewal.",
      solution: "Our Co-Pilot alerts you to decline temporary pauses and insist on permanent termination.",
    },
    {
      title: "Manufactured Fee Threats",
      badge: "Scare Tactic",
      trap: "Intimidating warnings about early termination fees ($165+) or lost cloud artifacts.",
      solution: "We provide step-by-step avoidance pathways (e.g. Adobe plan switch trick) to exit with zero fees.",
    },
  ];

  return (
    <div className="min-h-screen w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-8 relative bg-grid-blueprint">
      {/* ─── Top Header Navbar ─── */}
      <header className="w-full max-w-350 mx-auto flex items-center justify-between pb-5 mb-8 border-b border-[#d0e1ed]/70">
        {/* Brand Logo Capsule */}
        <div className="flex items-center space-x-3">
          <div
            onClick={onReset}
            className="inline-flex items-center justify-center bg-white/85 backdrop-blur-xl border border-white/90 rounded-full px-4 py-1.5 shadow-[0_4px_16px_-4px_rgba(31,85,150,0.15)] ring-1 ring-black/5 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-4px_rgba(22,88,235,0.25)] hover:border-[#1658eb]/40 active:scale-95 transition-all"
          >
            <Image
              src="/canceltrap-logo.webp"
              alt="CancelTrap"
              width={130}
              height={32}
              priority
              className="h-6 w-auto object-contain"
            />
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold flex items-center space-x-1.5 border border-emerald-200/80 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 beacon-pulse" />
            <span>Destination Resolved &middot; {confidence}% Verified</span>
          </span>
        </div>

        {/* Check Another Button */}
        <button
          type="button"
          onClick={onReset}
          className="btn-illuminate-ghost px-4 py-1.5 rounded-full font-semibold text-xs flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#54657a]" />
          <span>Check Another Service</span>
        </button>
      </header>

      {/* ─── Main Content Container (Full Width, Expansive) ─── */}
      <main className="w-full max-w-350 mx-auto space-y-7 text-left">
        {/* Breadcrumb Navigation Trail with Active Pulsing Ring */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl shadow-xs space-y-3 staged-enter staged-delay-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1658eb] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Verified Direct Defusal Route ({navigationSteps.length} Steps)</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {confidence}% Confidence &middot; {verifiedStatus}
              </span>
              <button
                onClick={() => handleOpenPortal(0)}
                className="text-[11px] font-bold text-[#1658eb] hover:text-[#1246c4] flex items-center gap-1 cursor-pointer group"
              >
                <span>Launch Co-Pilot</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            {navigationSteps.map((step, i) => (
              <React.Fragment key={step.stepNumber}>
                <div
                  onClick={() => handleOpenPortal(i)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-medium cursor-pointer transition-all ${
                    completedSteps[step.stepNumber]
                      ? "bg-emerald-50/90 border-emerald-300 text-emerald-900 shadow-xs"
                      : "bg-slate-50/90 hover:bg-blue-50/80 border-slate-200 text-[#0c1b38] hover:border-blue-300 hover:shadow-xs"
                  }`}
                >
                  <span
                    className={`step-checkbox w-4 h-4 rounded-full flex items-center justify-center font-mono text-[10px] ${
                      completedSteps[step.stepNumber]
                        ? "bg-emerald-600 text-white"
                        : "bg-[#1658eb] text-white"
                    }`}
                  >
                    {completedSteps[step.stepNumber] ? "✓" : step.stepNumber}
                  </span>
                  <span className="line-clamp-1">{step.instruction.split(".")[0]}</span>
                </div>
                {i < navigationSteps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 1: THE QUICK SCAN RESULTS (3 DYNAMIC, ILLUMINATED CARDS)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="space-y-3 staged-enter staged-delay-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-blue-100 text-[#1658eb] tracking-wider">
                Resolution Intelligence
              </span>
              <span className="text-xs text-[#556987] hidden sm:inline">
                Surgical analysis &amp; bypass route for {merchantName}:
              </span>
            </div>

            {/* Timeframe selector for Bleed Meter */}
            <div className="flex items-center space-x-1 bg-white/90 p-1 rounded-full border border-slate-200 text-xs shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 px-2 hidden md:inline">
                Bleed Horizon:
              </span>
              {[1, 3, 5].map((yrs) => (
                <button
                  key={yrs}
                  onClick={() => setTimeframeYears(yrs)}
                  className={`px-3 py-1 rounded-full font-bold text-[11px] transition-all cursor-pointer ${
                    timeframeYears === yrs
                      ? "btn-illuminate-primary shadow-xs"
                      : "text-slate-600 hover:text-[#1658eb] hover:bg-slate-100/70"
                  }`}
                >
                  {yrs} {yrs === 1 ? "Year" : "Years"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {/* Card 1: 🏢 Company Identified */}
            <div className="glass-card card-hover-lift p-6 rounded-3xl flex flex-col justify-between space-y-4 staged-enter staged-delay-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#556987] uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-[#1658eb]" />
                <span>Service Identified</span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-2xl font-extrabold text-[#0c1b38] font-display tracking-tight">
                  {merchantName}
                </h3>
                <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100/90 text-[#556987]">
                  {category}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#556987]">
                <span>Verified Direct Endpoint</span>
                <span className="font-mono text-emerald-700 font-bold">100% Unmasked</span>
              </div>
            </div>

            {/* Card 2: 💰 Amount at Risk (Dynamic Bleed Horizon) */}
            <div className="glass-card card-hover-lift p-6 rounded-3xl flex flex-col justify-between space-y-4 relative overflow-hidden staged-enter staged-delay-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#556987] uppercase tracking-wider">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Amount at Risk</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                  Renews in {days} {days === 1 ? "day" : "days"}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-3xl font-extrabold text-[#0c1b38] font-display tracking-tight">
                    {currency}{amount.toFixed(2)}
                  </span>
                  <span className="text-xs font-medium text-[#556987]">
                    / {billingCycle}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Auto-renews continuously until manually terminated.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <TrendingDown className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>{currency}{calculatedBleed.toFixed(0)}</strong> saved in {timeframeYears} {timeframeYears === 1 ? "year" : "years"}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-700 uppercase font-mono">Protected</span>
              </div>
            </div>

            {/* Card 3: ⚠️ Why You Were Stuck & Dark Pattern Decoy */}
            <div className="glass-card card-hover-lift p-6 rounded-3xl border border-amber-200/90 bg-linear-to-br from-amber-50/80 via-white/80 to-amber-50/40 shadow-[0_15px_35px_-10px_rgba(234,179,8,0.15)] hover:border-amber-400 hover:shadow-[0_22px_45px_-10px_rgba(234,179,8,0.25)] flex flex-col justify-between space-y-4 staged-enter staged-delay-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Dark Pattern Dissected</span>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-[#0c1b38]">
                  {patternType}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                  {patternSummary}
                </p>
              </div>

              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                <span>Direct Bypass Ready</span>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Zero Penalties
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 2: TAKING ACTION (IN-APP WINDOW & PEACE-OF-MIND CALENDAR)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="space-y-4 staged-enter staged-delay-5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-[#1658eb] text-white tracking-wider">
              Take Action
            </span>
            <span className="text-xs text-[#556987]">
              Choose how you want to take care of this right now:
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* ACTION 1: THE IN-APP GUIDED WINDOW (7 COLS) */}
            <div className="lg:col-span-7 glass-card card-hover-lift p-6 sm:p-8 rounded-3xl border-2 border-[#1658eb]/40 hover:border-[#1658eb] bg-linear-to-br from-white/95 via-blue-50/40 to-white/95 shadow-[0_20px_50px_-15px_rgba(22,88,235,0.2)] flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-blue-100 text-[#1658eb] tracking-wider flex items-center space-x-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#1658eb]" />
                    <span>Recommended &middot; In-App Guided Window</span>
                  </span>
                  {portalOpened && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5 stroke-3" />
                      <span>Co-Pilot Active</span>
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-extrabold text-[#0c1b38] font-display tracking-tight">
                  Launch In-App Defusal Guide
                </h3>

                <p className="text-xs sm:text-sm text-[#556987] leading-relaxed">
                  Instead of sending you away to get lost in menus, CancelTrap opens an
                  <strong> interactive window right inside our app</strong>. Our live co-pilot
                  highlights the exact buttons to click, warns you about sneaky traps,
                  and guides you step by step.
                </p>

                <div className="p-3.5 rounded-2xl bg-white/90 border border-[#d0e1ed] flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-[#1658eb] font-mono font-semibold truncate">
                    <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">https://{portalHostname}</span>
                  </div>
                  <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded font-semibold shrink-0 hidden sm:inline">
                    Verified Destination
                  </span>
                </div>
              </div>

              {/* Action Buttons with Tactile Physics */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenPortal(0)}
                  className="btn-illuminate-primary py-3.5 px-8 rounded-full font-bold text-sm shadow-xl cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Open In-App Cancel Window</span>
                  <Maximize2 className="w-3.5 h-3.5 ml-1" />
                </button>

                <button
                  type="button"
                  onClick={() => setMarkedCanceled(true)}
                  className={`py-3 px-6 rounded-full font-semibold text-xs cursor-pointer flex items-center justify-center space-x-1.5 transition-all ${
                    markedCanceled
                      ? "btn-illuminate-emerald"
                      : "btn-illuminate-ghost"
                  }`}
                >
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>
                    {markedCanceled ? "Canceled ✓" : "Mark as Canceled"}
                  </span>
                </button>
              </div>
            </div>

            {/* ACTION 2: THE CALENDAR REMINDER (5 COLS) */}
            <div className="lg:col-span-5 glass-card card-hover-lift p-6 sm:p-8 rounded-3xl flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-slate-100 text-[#556987] tracking-wider">
                  Peace of Mind
                </span>

                <h3 className="text-xl font-bold text-[#0c1b38] font-display tracking-tight">
                  Set a Reminder
                </h3>

                <p className="text-xs text-[#556987] leading-relaxed">
                  If you want to keep using the trial for a few more days, add
                  an automated reminder to your calendar 2 days before the
                  renewal cutoff so you never forget.
                </p>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center space-x-2 font-semibold text-[#0c1b38]">
                    <Clock className="w-4 h-4 text-[#1658eb]" />
                    <span>
                      Alert:{" "}
                      <strong>{formatAlertDate(data?.killSwitch?.suggestedAlertDate)}</strong>
                    </span>
                  </div>
                  <p className="text-[11px] text-[#556987]">
                    Includes the direct cancel link right inside the calendar event.
                  </p>
                </div>
              </div>

              {/* Download Calendar Button */}
              <button
                type="button"
                onClick={handleDownloadIcs}
                className={`w-full py-3.5 px-6 rounded-full font-semibold text-xs sm:text-sm cursor-pointer flex items-center justify-center space-x-2 transition-all ${
                  reminderAdded
                    ? "btn-illuminate-emerald"
                    : "btn-illuminate-ghost hover:border-[#1658eb]"
                }`}
              >
                {reminderAdded ? (
                  <>
                    <Check className="w-4 h-4 stroke-3 text-white" />
                    <span>Reminder Added to Calendar ✓</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 text-[#1658eb]" />
                    <span>Add Reminder to Calendar (.ics)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3: INTERACTIVE DARK PATTERN X-RAY DISSECTION
        ═══════════════════════════════════════════════════════════════ */}
        <div className="glass-card card-hover-lift p-6 sm:p-8 rounded-3xl space-y-5 text-left staged-enter staged-delay-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-[#1658eb]" />
              <h4 className="text-base font-bold text-[#0c1b38]">
                Interactive Dark Pattern X-Ray Lens
              </h4>
            </div>
            <span className="text-xs text-slate-500">
              Click any trap to see how companies design friction:
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trapDeconstructions.map((t, index) => (
              <div
                key={index}
                onClick={() => setSelectedTrapTab(index)}
                className={`p-5 rounded-2xl border text-left cursor-pointer transition-all space-y-3 ${
                  selectedTrapTab === index
                    ? "bg-blue-50/90 border-[#1658eb] shadow-[0_12px_28px_-6px_rgba(22,88,235,0.25)] ring-2 ring-[#1658eb]/40"
                    : "glass-card hover:border-[#1658eb]/40 hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0c1b38] font-display">
                    {t.title}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {t.badge}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5">
                  <p>
                    <strong className="text-rose-700 block">The Decoy:</strong>
                    {t.trap}
                  </p>
                  <p>
                    <strong className="text-emerald-700 block">CancelTrap Bypass:</strong>
                    {t.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 4: STEP-BY-STEP DEFUSAL ROUTE (CHECKABLE STEPS)
        ═══════════════════════════════════════════════════════════════ */}
        {navigationSteps && navigationSteps.length > 0 && (
          <div className="glass-card card-hover-lift p-6 sm:p-8 rounded-3xl space-y-4 text-left staged-enter staged-delay-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-[#1658eb]" />
                <h4 className="text-base font-bold text-[#0c1b38]">
                  Verified Step-by-Step Defusal Route
                </h4>
              </div>
              <button
                type="button"
                onClick={() => handleOpenPortal(0)}
                className="text-xs font-semibold text-[#1658eb] hover:text-[#1246c4] flex items-center space-x-1 cursor-pointer group"
              >
                <span>Follow along in In-App Window</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {navigationSteps.map((step: { stepNumber: number; instruction: string; decoyWarning?: string }, i: number) => {
                const isChecked = !!completedSteps[step.stepNumber];
                return (
                  <div
                    key={step.stepNumber}
                    className={`p-5 rounded-2xl border space-y-3 flex flex-col justify-between transition-all card-hover-lift ${
                      isChecked
                        ? "bg-emerald-50/80 border-emerald-300 shadow-xs"
                        : "glass-card hover:border-[#1658eb]/40"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleStepCheckbox(step.stepNumber)}
                            className={`step-checkbox w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all cursor-pointer ${
                              isChecked
                                ? "btn-illuminate-emerald"
                                : "bg-blue-100/90 text-[#1658eb] hover:bg-blue-200"
                            }`}
                          >
                            {isChecked ? "✓" : step.stepNumber}
                          </button>
                          <span className="text-xs font-bold text-[#0c1b38] uppercase tracking-wider">
                            Step {step.stepNumber}
                          </span>
                        </div>

                        <button
                          onClick={() => handleOpenPortal(i)}
                          className="text-[11px] font-semibold text-[#1658eb] hover:text-[#1246c4] hover:underline"
                        >
                          View in Window →
                        </button>
                      </div>

                      <p className="text-xs text-[#556987] leading-relaxed">
                        {step.instruction}
                      </p>
                    </div>

                    {step.decoyWarning && (
                      <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-800 text-[11px] flex items-start space-x-1.5 mt-2 shadow-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>Trap Warning:</strong> {step.decoyWarning}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 5: FTC 16 CFR Part 425 LEGAL NOTICE & DISPUTE GENERATOR
        ═══════════════════════════════════════════════════════════════ */}
        <div className="glass-card card-hover-lift p-6 sm:p-7 rounded-3xl space-y-3 text-left staged-enter staged-delay-8">
          <div
            onClick={() => setIsLegalNoticeOpen(!isLegalNoticeOpen)}
            className="flex items-center justify-between cursor-pointer select-none group"
          >
            <div className="flex items-center space-x-2.5">
              <Scale className="w-4 h-4 text-[#1658eb] group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="text-sm font-bold text-[#0c1b38] group-hover:text-[#1658eb] transition-colors">
                  FTC &apos;Click-to-Cancel&apos; Legal Dispute Notice Generator
                </h4>
                <p className="text-xs text-slate-500">
                  Legally-binding pre-drafted cancellation demand under 16 CFR Part 425
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#1658eb] border border-blue-200 hidden sm:inline">
                Instant Copy Ready
              </span>
              {isLegalNoticeOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-[#1658eb] transition-colors" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#1658eb] transition-colors" />
              )}
            </div>
          </div>

          {isLegalNoticeOpen && (
            <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-200">
              <p className="text-xs text-slate-600">
                If {merchantName} gives you a hard time, refuses to cancel, or their portal errors out, copy this formal revocation notice and email it to their support desk or upload it to your credit card chargeback dispute.
              </p>

              <div className="relative">
                <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto border border-slate-800 shadow-inner">
                  {generatedLegalNotice}
                </pre>

                <button
                  type="button"
                  onClick={handleCopyLegalNotice}
                  className="btn-illuminate-primary absolute top-3 right-3 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-md cursor-pointer"
                >
                  {copiedNotice ? (
                    <>
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Legal Notice</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 6: THE SUCCESS (CHEERFUL GREEN RELIEF BANNER)
        ═══════════════════════════════════════════════════════════════ */}
        {markedCanceled && (
          <div className="glass-card card-hover-lift p-6 sm:p-8 rounded-3xl border-2 border-emerald-400 bg-linear-to-r from-emerald-50/90 via-white/95 to-teal-50/90 shadow-[0_25px_60px_-15px_rgba(16,185,129,0.25)] flex flex-col sm:flex-row items-center justify-between gap-6 text-left animate-in fade-in zoom-in-95 duration-300 w-full relative overflow-hidden">
            {/* Ambient relief confetti spark */}
            <div className="absolute top-2 right-4 text-emerald-400/40 text-2xl select-none">
              ✦ ✧ ✦
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
                <Sparkles className="w-7 h-7 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-lg sm:text-xl font-extrabold text-[#0c1b38] font-display">
                    Subscription Canceled Successfully!
                  </h4>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                    Money Saved
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#556987] leading-relaxed">
                  You just defended your wallet! You stopped{" "}
                  <strong className="text-emerald-700 font-extrabold">
                    {currency}{amount.toFixed(2)}/month
                  </strong>{" "}
                  and kept{" "}
                  <strong className="text-emerald-700 font-extrabold">
                    {currency}{calculatedBleed.toFixed(2)}
                  </strong>{" "}
                  safe in your bank account over {timeframeYears} {timeframeYears === 1 ? "year" : "years"}.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onReset}
              className="btn-illuminate-primary py-3.5 px-7 rounded-full font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 cursor-pointer flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Rescue Another Subscription</span>
            </button>
          </div>
        )}
      </main>

      {/* ── In-App Defusal Window Modal ── */}
      <InAppDefusalWindow
        data={data}
        destination={destination}
        isOpen={isInAppWindowOpen}
        onClose={() => setIsInAppWindowOpen(false)}
        onMarkCanceled={() => {
          setMarkedCanceled(true);
          setPortalOpened(true);
        }}
        onDownloadIcs={handleDownloadIcs}
        isCanceled={markedCanceled}
        initialStep={activeStepInModal}
      />
    </div>
  );
}
