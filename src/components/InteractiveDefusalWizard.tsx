"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Calendar,
  Check,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Clock,
  Sparkles,
  Download,
  RotateCcw,
  CheckCircle2,
  Lock,
  ChevronRight,
  DollarSign,
  TrendingDown,
  Info,
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

  // Active step: 1 | 2 | 3
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Completed steps
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);

  // Checked off items in step 2
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  // Clean URL helper
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
      return merchant?.directPortalUrl || "cancellation page";
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

  const toggleItemCheck = (idx: number) => {
    setCheckedItems((prev) => {
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

  const handleCompleteStep2 = () => {
    const all: Record<number, boolean> = {};
    defusalChecklist.forEach((_, i) => (all[i] = true));
    setCheckedItems(all);
    setStep2Done(true);
    setCurrentStep(3);
  };

  const handleDownloadIcs = () => {
    const safeKillSwitch = {
      eventTitle:
        killSwitch?.eventTitle ||
        `Reminder: Cancel ${merchant?.name || "Subscription"}`,
      suggestedAlertDate:
        killSwitch?.suggestedAlertDate ||
        new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      alertMinutesBefore: killSwitch?.alertMinutesBefore || 120,
      eventDescription:
        killSwitch?.eventDescription ||
        `Reminder to cancel ${
          merchant?.name || "subscription"
        } before auto-renewal. Direct cancellation link: ${getCleanPortalUrl()}`,
    };

    const cleanFilename = `cancel-${(merchant?.name || "subscription")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")}-reminder.ics`;

    try {
      downloadKillSwitchIcs(safeKillSwitch, cleanFilename);
    } catch (e) {
      console.warn("ICS download issue:", e);
    }
    setStep3Done(true);
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

  const amount = Number(billing?.amount ?? 0);
  const bleed = Number(billing?.vampireBleed5Year ?? amount * 60);
  const allComplete = step1Done && step2Done && step3Done;

  return (
    <div className="w-full space-y-6">
      {/* ─── Main Step Container ─── */}
      <div className="glass-card p-5 sm:p-7 relative overflow-hidden text-left border border-white shadow-[0_20px_50px_-15px_rgba(22,88,235,0.14)]">
        {/* Top 3-Step Navigation Tabs */}
        <div className="relative mb-6 pb-5 border-b border-[#d0e1ed]/70">
          <div className="flex items-center justify-between gap-2 max-w-2xl mx-auto">
            {/* Step 1 Tab */}
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex-1 flex items-center space-x-3 p-3 rounded-2xl transition-all cursor-pointer border ${
                step1Done
                  ? currentStep === 1
                    ? "bg-emerald-50 text-emerald-900 border-emerald-300 shadow-sm ring-2 ring-emerald-500/20"
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
                  Step 01
                </span>
                <span className="text-xs sm:text-sm font-bold truncate block font-display">
                  Cancellation Page
                </span>
              </div>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden sm:block" />

            {/* Step 2 Tab */}
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`flex-1 flex items-center space-x-3 p-3 rounded-2xl transition-all cursor-pointer border ${
                step2Done
                  ? currentStep === 2
                    ? "bg-emerald-50 text-emerald-900 border-emerald-300 shadow-sm ring-2 ring-emerald-500/20"
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
                  Step 02
                </span>
                <span className="text-xs sm:text-sm font-bold truncate block font-display">
                  Avoid Sneaky Offers
                </span>
              </div>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden sm:block" />

            {/* Step 3 Tab */}
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className={`flex-1 flex items-center space-x-3 p-3 rounded-2xl transition-all cursor-pointer border ${
                step3Done
                  ? currentStep === 3
                    ? "bg-emerald-50 text-emerald-900 border-emerald-300 shadow-sm ring-2 ring-emerald-500/20"
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
                  Step 03
                </span>
                <span className="text-xs sm:text-sm font-bold truncate block font-display">
                  Set Reminder
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            STEP 1: GO TO CANCELLATION PAGE
        ═══════════════════════════════════════════════════════════════ */}
        {currentStep === 1 && (
          <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-200">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-[#1658eb]">
                  Step 1 of 3
                </span>
                {step1Done && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Page Opened</span>
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0c1b38] font-display mt-2">
                Go to the Cancellation Page
              </h3>
              <p className="text-xs sm:text-sm text-[#556987] mt-1 leading-relaxed">
                No need to search through account settings. Click the button
                below to open the exact cancellation page for{" "}
                <strong>{merchant?.name}</strong>.
              </p>
            </div>

            {/* Direct Link Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/90 border border-[#d0e1ed] shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs text-[#556987]">
                <span className="font-semibold text-[#0c1b38] flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Direct link to your account</span>
                </span>
                <span className="text-[11px] bg-slate-100 px-2.5 py-0.5 rounded-full font-medium">
                  Official Website
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/70">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#1658eb] text-white flex items-center justify-center shrink-0">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono text-xs sm:text-sm font-semibold text-[#1658eb] truncate">
                    {portalHostname}
                  </span>
                </div>

                <span className="text-xs text-[#556987] shrink-0 hidden sm:inline">
                  Opens in new tab
                </span>
              </div>

              <p className="text-xs text-[#556987]">
                💡 <strong>Tip:</strong> Keep this tab open while you cancel on their website so you can follow the next step.
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#556987]">
                Clicking opens the cancellation page in a new window.
              </span>

              <button
                type="button"
                onClick={handleOpenPortal}
                className={`py-3 px-6 rounded-full font-semibold text-xs sm:text-sm flex items-center space-x-2 transition-all cursor-pointer shadow-md ${
                  step1Done
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-[#1658eb] hover:bg-[#1246c4] text-white hover:-translate-y-0.5"
                }`}
              >
                {step1Done ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Page Opened &middot; Continue to Step 2 &rarr;</span>
                  </>
                ) : (
                  <>
                    <span>Open Cancellation Page</span>
                    <ExternalLink className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            STEP 2: AVOID SNEAKY OFFERS
        ═══════════════════════════════════════════════════════════════ */}
        {currentStep === 2 && (
          <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-200">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900">
                  Step 2 of 3
                </span>
                {step2Done && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Ready</span>
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0c1b38] font-display mt-2">
                Watch Out for Sneaky Offers
              </h3>
              <p className="text-xs sm:text-sm text-[#556987] mt-1 leading-relaxed">
                Websites usually show discounts or &quot;pause account&quot; pop-ups to make you stay. Follow these instructions so you don&apos;t get tricked:
              </p>
            </div>

            {/* Checkpoints */}
            <div className="space-y-3">
              {defusalChecklist.map((item, idx) => {
                const isChecked = !!checkedItems[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleItemCheck(idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                      isChecked
                        ? "bg-emerald-50/80 border-emerald-200 text-[#0c1b38]"
                        : "bg-white/90 border-[#d0e1ed] hover:border-[#1658eb]/50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg mt-0.5 flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                        isChecked
                          ? "bg-emerald-600 text-white"
                          : "border-2 border-slate-300 bg-white"
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs sm:text-sm text-[#0c1b38] leading-snug">
                        {item.instruction}
                      </p>

                      {item.decoyWarning && (
                        <div className="mt-2 p-2 rounded-xl bg-amber-50/90 border border-amber-200 flex items-center space-x-2 text-xs text-amber-900">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="font-medium text-[11px]">
                            <strong>Watch out:</strong> {item.decoyWarning}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="py-2.5 px-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0c1b38] flex items-center space-x-1.5 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleCompleteStep2}
                className="py-3 px-6 rounded-full font-semibold text-xs sm:text-sm flex items-center space-x-2 transition-all cursor-pointer shadow-md bg-[#1658eb] hover:bg-[#1246c4] text-white hover:-translate-y-0.5"
              >
                <span>Continue to Step 3: Set Reminder &rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            STEP 3: SET CALENDAR REMINDER
        ═══════════════════════════════════════════════════════════════ */}
        {currentStep === 3 && (
          <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-200">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-[#1658eb]">
                  Step 3 of 3
                </span>
                {step3Done && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Reminder Added</span>
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0c1b38] font-display mt-2">
                Set a Reminder Before You Get Charged
              </h3>
              <p className="text-xs sm:text-sm text-[#556987] mt-1 leading-relaxed">
                Add an automatic reminder to your calendar 2 days before the
                renewal date so you never get surprised by a charge.
              </p>
            </div>

            {/* Reminder Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/90 border border-[#d0e1ed] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1658eb] flex items-center justify-center font-bold">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#0c1b38]">
                      Cancel {merchant?.name || "Subscription"} Reminder
                    </h4>
                    <p className="text-[11px] text-[#556987]">
                      Works with Apple Calendar, Google Calendar, &amp; Outlook
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  2 Days Before
                </span>
              </div>

              {/* Scheduled Time Box */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center space-x-3 text-xs sm:text-sm font-semibold text-[#0c1b38]">
                <Clock className="w-4 h-4 text-[#1658eb] shrink-0" />
                <span>
                  Alert scheduled for:{" "}
                  <strong>{formatAlertDate(killSwitch?.suggestedAlertDate)}</strong>
                </span>
              </div>

              {/* Savings preview */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-[#556987]">Money you save by canceling:</span>
                <span className="font-bold text-emerald-700 text-sm">
                  ${bleed.toFixed(2)} over 5 years
                </span>
              </div>
            </div>

            {/* Navigation Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="py-2.5 px-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0c1b38] flex items-center space-x-1.5 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadIcs}
                className={`py-3 px-6 rounded-full font-semibold text-xs sm:text-sm flex items-center space-x-2 transition-all cursor-pointer shadow-md ${
                  step3Done
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-[#1658eb] hover:bg-[#1246c4] text-white hover:-translate-y-0.5"
                }`}
              >
                {step3Done ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Reminder Downloaded &middot; You&apos;re Done ✓</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Add to Calendar (.ics)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          COMPLETION CELEBRATION (PLAIN ENGLISH)
      ═══════════════════════════════════════════════════════════════ */}
      {allComplete && (
        <div className="glass-card p-5 sm:p-6 border-emerald-300/80 bg-gradient-to-r from-emerald-50/95 via-white/90 to-blue-50/95 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-left animate-in fade-in duration-300">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-base font-bold text-[#0c1b38] font-display">
                  You&apos;re All Set!
                </h4>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                  Protected
                </span>
              </div>
              <p className="text-xs text-[#556987] mt-0.5 leading-relaxed">
                You opened the cancellation page, dodged the retention offers,
                and scheduled a calendar reminder. You&apos;ll save{" "}
                <strong className="text-emerald-700 font-bold">
                  {billing?.currency || "$"}{bleed.toFixed(2)}
                </strong>{" "}
                over the next 5 years.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              type="button"
              onClick={onReset}
              className="px-5 py-2.5 rounded-full bg-[#1658eb] hover:bg-[#1246c4] text-white font-semibold text-xs flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer hover:-translate-y-0.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Check Another Subscription</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
