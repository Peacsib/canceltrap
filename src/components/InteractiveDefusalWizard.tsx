"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Calendar,
  Check,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Clock,
  Ban,
  Sparkles,
  Download,
  RotateCcw,
  CheckCircle2,
  Lock,
  ShieldAlert,
  Zap,
  TrendingDown,
  DollarSign,
  ChevronRight,
  Shield,
} from "lucide-react";
import { SubscriptionDefusalResponse } from "@/lib/types";
import { downloadKillSwitchIcs } from "@/lib/calendar";

interface InteractiveDefusalWizardProps {
  data: SubscriptionDefusalResponse;
  onReset: () => void;
}

export function InteractiveDefusalWizard({
  data,
  onReset,
}: InteractiveDefusalWizardProps) {
  const { merchant, billing, darkPattern, defusalChecklist, killSwitch } = data;

  // Active step in the wizard: 1 | 2 | 3
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Completion statuses
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);

  // Sub-step checks in Step 2 (Decoys)
  const [disarmedTraps, setDisarmedTraps] = useState<Record<number, boolean>>({});

  // Direct portal link cleaner
  const getCleanPortalUrl = () => {
    const raw = merchant?.directPortalUrl?.trim();
    if (raw && (raw.startsWith("http://") || raw.startsWith("https://"))) {
      return raw;
    }
    if (raw && raw.includes(".")) {
      return `https://${raw}`;
    }
    return `https://www.google.com/search?q=${encodeURIComponent(
      "how to cancel " + (merchant?.name || "subscription")
    )}`;
  };

  const portalHostname = (() => {
    try {
      const url = new URL(getCleanPortalUrl());
      return url.hostname + (url.pathname.length > 1 ? url.pathname : "");
    } catch {
      return merchant?.directPortalUrl || "account.vendor.com/plans";
    }
  })();

  const handleOpenPortal = () => {
    const targetUrl = getCleanPortalUrl();
    try {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    } catch (e) {
      console.warn("Popup blocked:", e);
    }
    setStep1Done(true);
    setCurrentStep(2);
  };

  const toggleTrapDisarm = (idx: number) => {
    setDisarmedTraps((prev) => {
      const next = { ...prev, [idx]: !prev[idx] };
      const allDone =
        defusalChecklist.length > 0 &&
        defusalChecklist.every((_, i) => !!next[i]);
      if (allDone) {
        setStep2Done(true);
      }
      return next;
    });
  };

  const handleDisarmAllTraps = () => {
    const all: Record<number, boolean> = {};
    defusalChecklist.forEach((_, i) => (all[i] = true));
    setDisarmedTraps(all);
    setStep2Done(true);
    setCurrentStep(3);
  };

  const handleDownloadIcs = () => {
    const safeKillSwitch = {
      eventTitle:
        killSwitch?.eventTitle ||
        `🚨 Kill-Switch: Cancel ${merchant?.name || "Subscription"}`,
      suggestedAlertDate:
        killSwitch?.suggestedAlertDate ||
        new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      alertMinutesBefore: killSwitch?.alertMinutesBefore || 120,
      eventDescription:
        killSwitch?.eventDescription ||
        `Reminder to cancel ${
          merchant?.name || "subscription"
        } before auto-renewal.`,
    };

    const cleanFilename = `${(merchant?.name || "subscription")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")}-kill-switch.ics`;

    try {
      downloadKillSwitchIcs(safeKillSwitch, cleanFilename);
    } catch (e) {
      console.warn("ICS download issue:", e);
    }
    setStep3Done(true);
  };

  // Format alert date
  const formatAlertDate = (dateStr?: string) => {
    if (!dateStr) return "48 hours before renewal";
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

  const amount = Number(billing?.amount ?? 0);
  const bleed = Number(billing?.vampireBleed5Year ?? amount * 60);

  const completedCount =
    (step1Done ? 1 : 0) + (step2Done ? 1 : 0) + (step3Done ? 1 : 0);
  const allComplete = step1Done && step2Done && step3Done;

  return (
    <div className="w-full space-y-6">
      {/* ═══════════════════════════════════════════════════════════════
          WIZARD CONTAINER (STRIPE / LINEAR ULTRA-CLEAN STYLE)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="glass-card p-5 sm:p-7 relative overflow-hidden text-left border border-white shadow-[0_20px_50px_-15px_rgba(22,88,235,0.16)]">
        {/* Subtle Background Accent Gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-100/50 via-emerald-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* ─── Segmented Stepper Bar ─── */}
        <div className="relative mb-6 pb-5 border-b border-[#d0e1ed]/70">
          <div className="flex items-center justify-between gap-2 max-w-2xl mx-auto">
            {/* Step 1 Pill */}
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex-1 flex items-center space-x-3 p-3 rounded-2xl transition-all cursor-pointer border ${
                step1Done
                  ? currentStep === 1
                    ? "bg-emerald-50 text-emerald-900 border-emerald-300 shadow-sm ring-2 ring-emerald-500/25"
                    : "bg-emerald-50/80 text-emerald-900 border-emerald-200"
                  : currentStep === 1
                  ? "bg-white text-[#0c1b38] border-[#1658eb]/40 shadow-sm ring-2 ring-[#1658eb]/20"
                  : "bg-white/60 text-[#556987] border-transparent hover:bg-white"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  step1Done
                    ? "bg-emerald-500 text-white"
                    : currentStep === 1
                    ? "bg-[#1658eb] text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {step1Done ? <Check className="w-4 h-4 stroke-[3]" /> : "1"}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-extrabold tracking-wider block text-[#556987]">
                  Phase 01
                </span>
                <span className="text-xs sm:text-sm font-bold truncate block font-display">
                  Direct Bypass
                </span>
              </div>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden sm:block" />

            {/* Step 2 Pill */}
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`flex-1 flex items-center space-x-3 p-3 rounded-2xl transition-all cursor-pointer border ${
                step2Done
                  ? currentStep === 2
                    ? "bg-emerald-50 text-emerald-900 border-emerald-300 shadow-sm ring-2 ring-emerald-500/25"
                    : "bg-emerald-50/80 text-emerald-900 border-emerald-200"
                  : currentStep === 2
                  ? "bg-white text-[#0c1b38] border-[#1658eb]/40 shadow-sm ring-2 ring-[#1658eb]/20"
                  : "bg-white/60 text-[#556987] border-transparent hover:bg-white"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  step2Done
                    ? "bg-emerald-500 text-white"
                    : currentStep === 2
                    ? "bg-[#1658eb] text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {step2Done ? <Check className="w-4 h-4 stroke-[3]" /> : "2"}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-extrabold tracking-wider block text-[#556987]">
                  Phase 02
                </span>
                <span className="text-xs sm:text-sm font-bold truncate block font-display">
                  Evade Decoys
                </span>
              </div>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden sm:block" />

            {/* Step 3 Pill */}
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className={`flex-1 flex items-center space-x-3 p-3 rounded-2xl transition-all cursor-pointer border ${
                step3Done
                  ? currentStep === 3
                    ? "bg-emerald-50 text-emerald-900 border-emerald-300 shadow-sm ring-2 ring-emerald-500/25"
                    : "bg-emerald-50/80 text-emerald-900 border-emerald-200"
                  : currentStep === 3
                  ? "bg-white text-[#0c1b38] border-[#1658eb]/40 shadow-sm ring-2 ring-[#1658eb]/20"
                  : "bg-white/60 text-[#556987] border-transparent hover:bg-white"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  step3Done
                    ? "bg-emerald-500 text-white"
                    : currentStep === 3
                    ? "bg-[#1658eb] text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {step3Done ? <Check className="w-4 h-4 stroke-[3]" /> : "3"}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-extrabold tracking-wider block text-[#556987]">
                  Phase 03
                </span>
                <span className="text-xs sm:text-sm font-bold truncate block font-display">
                  Arm Cutoff
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            ACTIVE STEP STAGE
        ═══════════════════════════════════════════════════════════════ */}

        {/* ──────── STEP 1: DIRECT PORTAL BYPASS SIMULATOR ──────── */}
        {currentStep === 1 && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in zoom-in-98 duration-200">
            {/* Stage Title */}
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-100 text-[#1658eb] uppercase tracking-wider">
                  Step 01 &middot; Deep-Link Bypass
                </span>
                {step1Done && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Portal Verified</span>
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0c1b38] font-display mt-2">
                Bypass Settings Menus &amp; Jump to Cancellation
              </h3>
              <p className="text-xs sm:text-sm text-[#556987] mt-1 leading-relaxed">
                CancelTrap extracted the verified plan management endpoint. Skip
                nested account labyrinths and launch directly in one click.
              </p>
            </div>

            {/* Visual Route Pipeline Box */}
            <div className="p-5 rounded-2xl bg-white/90 border border-[#d0e1ed] shadow-xs space-y-4">
              <div className="flex items-center justify-between text-xs text-[#556987] pb-2 border-b border-slate-100">
                <span className="font-semibold text-[#0c1b38] flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Target Verified Endpoint</span>
                </span>
                <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                  SSL Encrypted
                </span>
              </div>

              {/* Endpoint Pill */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/70">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#1658eb] text-white flex items-center justify-center shrink-0">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono text-xs sm:text-sm font-semibold text-[#1658eb] truncate">
                    {portalHostname}
                  </span>
                </div>

                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full shrink-0 hidden sm:inline">
                  Skips 5 Sub-Menus
                </span>
              </div>

              {/* Route skipped comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-red-500 block">
                    Traditional Path (Traps)
                  </span>
                  <p className="text-slate-600 mt-1 line-through text-[11px]">
                    Settings &rarr; Account &rarr; Manage &rarr; Retention Survey &rarr; Cancel
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                    CancelTrap Deep-Link
                  </span>
                  <p className="text-emerald-900 font-semibold mt-1 text-[11px]">
                    Direct Deep-Link &rarr; Cancellation Portal
                  </p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#556987]">
                Clicking opens the cancellation center in a new tab.
              </span>

              <button
                type="button"
                onClick={handleOpenPortal}
                className={`py-3 px-6 rounded-full font-semibold text-sm flex items-center space-x-2 transition-all cursor-pointer shadow-md ${
                  step1Done
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-[#1658eb] hover:bg-[#1246c4] text-white hover:-translate-y-0.5"
                }`}
              >
                {step1Done ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Portal Launched &middot; Continue &rarr;</span>
                  </>
                ) : (
                  <>
                    <span>Open Portal Now</span>
                    <ExternalLink className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ──────── STEP 2: LIVE DECOY FILTER SIMULATOR ──────── */}
        {currentStep === 2 && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in zoom-in-98 duration-200">
            {/* Stage Title */}
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-900 uppercase tracking-wider">
                  Step 02 &middot; Decoy Disarmer
                </span>
                {step2Done && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>All Traps Defused</span>
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0c1b38] font-display mt-2">
                Neutralize Deceptive Retention Traps
              </h3>
              <p className="text-xs sm:text-sm text-[#556987] mt-1 leading-relaxed">
                Review the dark patterns detected on <strong>{merchant?.name}</strong>.
                Click each trap below to mark it disarmed.
              </p>
            </div>

            {/* Interactive Decoy Checklist Tiles */}
            <div className="space-y-3">
              {defusalChecklist.map((item, idx) => {
                const isDisarmed = !!disarmedTraps[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleTrapDisarm(idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                      isDisarmed
                        ? "bg-emerald-50/80 border-emerald-200 text-[#0c1b38] shadow-xs"
                        : "bg-white/90 border-[#d0e1ed] hover:border-[#1658eb]/50 hover:shadow-xs"
                    }`}
                  >
                    {/* Checkbox badge */}
                    <div
                      className={`w-5 h-5 rounded-lg mt-0.5 flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                        isDisarmed
                          ? "bg-emerald-600 text-white"
                          : "border-2 border-slate-300 bg-white"
                      }`}
                    >
                      {isDisarmed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-bold text-[#556987]">
                          Step {item.stepNumber}
                        </span>
                        {isDisarmed && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full">
                            DEFUSED ✓
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-xs sm:text-sm text-[#0c1b38] mt-0.5 leading-snug">
                        {item.instruction}
                      </p>

                      {item.decoyWarning && (
                        <div className="mt-2 p-2 rounded-xl bg-amber-50/90 border border-amber-200/80 flex items-center space-x-2 text-xs text-amber-900">
                          <Ban className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span className="font-medium text-[11px]">
                            <strong>Trap to dodge:</strong> {item.decoyWarning}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation & Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="py-2.5 px-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0c1b38] flex items-center space-x-1.5 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Portal</span>
              </button>

              <button
                type="button"
                onClick={handleDisarmAllTraps}
                className="py-3 px-6 rounded-full font-semibold text-sm flex items-center space-x-2 transition-all cursor-pointer shadow-md bg-[#1658eb] hover:bg-[#1246c4] text-white hover:-translate-y-0.5"
              >
                <span>
                  {step2Done
                    ? "Traps Defused &middot; Next Phase &rarr;"
                    : "Disarm All Traps & Continue &rarr;"}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ──────── STEP 3: CALENDAR KILL-SWITCH LOCK ──────── */}
        {currentStep === 3 && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in zoom-in-98 duration-200">
            {/* Stage Title */}
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-100 text-[#1658eb] uppercase tracking-wider">
                  Step 03 &middot; Renewal Lock
                </span>
                {step3Done && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Kill-Switch Armed</span>
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0c1b38] font-display mt-2">
                Arm Timed Auto-Renewal Cutoff
              </h3>
              <p className="text-xs sm:text-sm text-[#556987] mt-1 leading-relaxed">
                Never get hit by a surprise auto-renewal again. Generate a
                calibrated calendar alert pre-filled with the direct cancellation
                link.
              </p>
            </div>

            {/* Visual Calendar Lock Card */}
            <div className="p-6 rounded-2xl bg-white/90 border border-[#d0e1ed] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1658eb] flex items-center justify-center font-bold">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0c1b38]">
                      {killSwitch?.eventTitle || "Subscription Renewal Cutoff"}
                    </h4>
                    <p className="text-xs text-[#556987]">
                      RFC 5545 standard &middot; Works natively with Apple, Google, &amp; Outlook
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                  Fires 48h Prior
                </span>
              </div>

              {/* Alert Time Highlight */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5">
                  <Clock className="w-4 h-4 text-[#1658eb]" />
                  <span className="text-xs sm:text-sm font-semibold text-[#0c1b38]">
                    Scheduled Alarm:{" "}
                    <strong>{formatAlertDate(killSwitch?.suggestedAlertDate)}</strong>
                  </span>
                </div>

                <span className="text-xs font-semibold text-[#1658eb] bg-white px-2.5 py-1 rounded-lg border border-blue-200 shrink-0">
                  Includes Direct Portal URL
                </span>
              </div>

              {/* 5-Year Vampire Bleed Shield Metric */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-[#556987] flex items-center space-x-1.5">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span>Protected Cumulative Drain:</span>
                </span>
                <span className="font-extrabold text-red-600 text-sm">
                  ${bleed.toFixed(2)} / 5-Yr Bleed
                </span>
              </div>
            </div>

            {/* Navigation & Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="py-2.5 px-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0c1b38] flex items-center space-x-1.5 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Decoys</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadIcs}
                className={`py-3 px-6 rounded-full font-semibold text-sm flex items-center space-x-2 transition-all cursor-pointer shadow-md ${
                  step3Done
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-[#1658eb] hover:bg-[#1246c4] text-white hover:-translate-y-0.5"
                }`}
              >
                {step3Done ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Kill-Switch Armed &middot; Complete ✓</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Kill-Switch (.ics)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          CELEBRATORY FULL-DEFUSAL TRIUMPH BANNER
      ═══════════════════════════════════════════════════════════════ */}
      {allComplete && (
        <div className="glass-card p-6 sm:p-7 border-emerald-300/80 bg-gradient-to-r from-emerald-50/95 via-white/90 to-blue-50/95 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-left animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-base sm:text-lg font-bold text-[#0c1b38] font-display">
                  Subscription Successfully Defused!
                </h4>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                  Protected
                </span>
              </div>
              <p className="text-xs text-[#556987] mt-1 leading-relaxed">
                Direct portal launched, retention decoys disarmed, and your
                48-hour cutoff alarm is locked in calendar. Estimated 5-year
                savings:{" "}
                <strong className="text-emerald-700 font-extrabold text-sm">
                  {billing?.currency || "$"}{bleed.toFixed(2)}
                </strong>
                .
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              type="button"
              onClick={onReset}
              className="px-5 py-2.5 rounded-full bg-[#1658eb] hover:bg-[#1246c4] text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-md cursor-pointer hover:-translate-y-0.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Scan Another Receipt</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
