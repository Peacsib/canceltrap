"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Calendar,
  Check,
  AlertTriangle,
  ArrowLeft,
  Clock,
  Sparkles,
  Download,
  RotateCcw,
  Lock,
  Info,
  ShieldCheck,
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
  const { merchant, billing, defusalChecklist, killSwitch } = data;

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
      {/* ─── Expansive Full-Width Glass Card ─── */}
      <div className="glass-card p-6 sm:p-8 lg:p-10 relative overflow-hidden text-left border border-white shadow-[0_20px_60px_-15px_rgba(22,88,235,0.14)] w-full">
        {/* Top 3-Step Navigation Stepper */}
        <div className="relative mb-8 pb-6 border-b border-[#d0e1ed]/70 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
            {/* Step 1 Tab */}
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex items-center space-x-3.5 p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer border text-left ${
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
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  step1Done
                    ? "bg-emerald-500 text-white"
                    : currentStep === 1
                    ? "bg-[#1658eb] text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {step1Done ? <Check className="w-4 h-4 stroke-3" /> : "1"}
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

            {/* Step 2 Tab */}
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`flex items-center space-x-3.5 p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer border text-left ${
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
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  step2Done
                    ? "bg-emerald-500 text-white"
                    : currentStep === 2
                    ? "bg-[#1658eb] text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {step2Done ? <Check className="w-4 h-4 stroke-3" /> : "2"}
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

            {/* Step 3 Tab */}
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className={`flex items-center space-x-3.5 p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer border text-left ${
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
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  step3Done
                    ? "bg-emerald-500 text-white"
                    : currentStep === 3
                    ? "bg-[#1658eb] text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {step3Done ? <Check className="w-4 h-4 stroke-3" /> : "3"}
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
            STEP 1: GO TO CANCELLATION PAGE (FULL-WIDTH EXPANSIVE LAYOUT)
        ═══════════════════════════════════════════════════════════════ */}
        {currentStep === 1 && (
          <div className="space-y-6 w-full animate-in fade-in duration-200">
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
              <p className="text-xs sm:text-sm text-[#556987] mt-1">
                No need to search through account settings. Click the button
                below to open the exact cancellation page for{" "}
                <strong>{merchant?.name}</strong>.
              </p>
            </div>

            {/* Expansive Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column (7 cols): Link Box & Action */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-white/90 border border-[#d0e1ed] shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#556987]">
                    <span className="font-semibold text-[#0c1b38] flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Direct link to your account</span>
                    </span>
                    <span className="text-[11px] bg-slate-100 px-2.5 py-0.5 rounded-full font-medium">
                      Official Website
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#1658eb] text-white flex items-center justify-center shrink-0">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-xs sm:text-sm font-semibold text-[#1658eb] truncate">
                        {portalHostname}
                      </span>
                    </div>

                    <span className="text-xs text-[#556987] shrink-0 hidden sm:inline">
                      Opens in new tab
                    </span>
                  </div>

                  <p className="text-xs text-[#556987] flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 inline" />
                    <span><strong>Tip:</strong> Keep this tab open while you cancel on their website so you can follow the next step.</span>
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleOpenPortal}
                    className={`w-full sm:w-auto py-3.5 px-8 rounded-full font-semibold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md ${
                      step1Done
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-[#1658eb] hover:bg-[#1246c4] text-white hover:-translate-y-0.5"
                    }`}
                  >
                    {step1Done ? (
                      <>
                        <Check className="w-4 h-4 stroke-3" />
                        <span>Page Opened &middot; Continue to Step 2 &rarr;</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {(merchant?.name || "").toLowerCase().includes("google cloud")
                            ? "Open Billing Console"
                            : "Open Cancellation Page"}
                        </span>
                        <ExternalLink className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column (5 cols): What to Do Next Preview */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between space-y-4">
                <span className="text-xs font-bold text-[#0c1b38] block uppercase tracking-wider">
                  What to do when the page opens:
                </span>

                <ol className="space-y-3 text-xs text-[#556987]">
                  <li className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1658eb] font-bold flex items-center justify-center shrink-0 text-[11px]">
                      1
                    </span>
                    <span>Sign in with the email address linked to your subscription.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1658eb] font-bold flex items-center justify-center shrink-0 text-[11px]">
                      2
                    </span>
                    <span>Click <strong>&quot;Manage plan&quot;</strong> or <strong>&quot;Cancel subscription&quot;</strong>.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1658eb] font-bold flex items-center justify-center shrink-0 text-[11px]">
                      3
                    </span>
                    <span>Come back to this page for <strong>Step 2</strong> to dodge their retention offers!</span>
                  </li>
                </ol>

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-[#556987] flex items-center space-x-2">
                  <Info className="w-4 h-4 text-[#1658eb] shrink-0" />
                  <span>Clicking the button will not cancel automatically — it takes you to the merchant&apos;s verified cancel page.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            STEP 2: AVOID SNEAKY OFFERS (FULL-WIDTH EXPANSIVE GRID)
        ═══════════════════════════════════════════════════════════════ */}
        {currentStep === 2 && (
          <div className="space-y-6 w-full animate-in fade-in duration-200">
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

            {/* Expansive Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {defusalChecklist.map((item, idx) => {
                const isChecked = !!checkedItems[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleItemCheck(idx)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isChecked
                        ? "bg-emerald-50/80 border-emerald-300 text-[#0c1b38] shadow-xs"
                        : "bg-white/90 border-[#d0e1ed] hover:border-[#1658eb]/50 hover:shadow-xs"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold text-[#556987]">
                          Instruction {item.stepNumber}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                            isChecked
                              ? "bg-emerald-600 text-white"
                              : "border-2 border-slate-300 bg-white"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-3" />}
                        </div>
                      </div>

                      <p className="font-semibold text-xs sm:text-sm text-[#0c1b38] leading-snug">
                        {item.instruction}
                      </p>
                    </div>

                    {item.decoyWarning && (
                      <div className="p-3 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span className="font-medium text-[11px] leading-relaxed">
                          <strong>Watch out:</strong> {item.decoyWarning}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Navigation Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-[#d0e1ed]/70">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="py-2.5 px-5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0c1b38] flex items-center space-x-1.5 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Step 1</span>
              </button>

              <button
                type="button"
                onClick={handleCompleteStep2}
                className="py-3 px-7 rounded-full font-semibold text-xs sm:text-sm flex items-center space-x-2 transition-all cursor-pointer shadow-md bg-[#1658eb] hover:bg-[#1246c4] text-white hover:-translate-y-0.5"
              >
                <span>Continue to Step 3: Set Reminder &rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            STEP 3: SET CALENDAR REMINDER (FULL-WIDTH EXPANSIVE LAYOUT)
        ═══════════════════════════════════════════════════════════════ */}
        {currentStep === 3 && (
          <div className="space-y-6 w-full animate-in fade-in duration-200">
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

            {/* Expansive Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column (7 cols): Reminder Action Card */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-white/90 border border-[#d0e1ed] shadow-xs flex flex-col justify-between space-y-5">
                <div className="space-y-4">
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
                          Compatible with Google Calendar, Apple Calendar, &amp; Outlook
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                      2 Days Before
                    </span>
                  </div>

                  {/* Scheduled Time Box */}
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center space-x-3 text-xs sm:text-sm font-semibold text-[#0c1b38]">
                    <Clock className="w-4 h-4 text-[#1658eb] shrink-0" />
                    <span>
                      Alert scheduled for:{" "}
                      <strong>{formatAlertDate(killSwitch?.suggestedAlertDate)}</strong>
                    </span>
                  </div>

                  <p className="text-xs text-[#556987]">
                    The calendar event includes the direct cancellation link and details so you can finish canceling in 30 seconds when the alarm goes off.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadIcs}
                    className={`w-full sm:w-auto py-3.5 px-8 rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md ${
                      step3Done
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-[#1658eb] hover:bg-[#1246c4] text-white hover:-translate-y-0.5"
                    }`}
                  >
                    {step3Done ? (
                      <>
                        <Check className="w-4 h-4 stroke-3" />
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

              {/* Right Column (5 cols): 5-Year Savings Breakdown */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between space-y-4">
                <span className="text-xs font-bold text-emerald-950 block uppercase tracking-wider">
                  Money You Save by Canceling
                </span>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-200/60">
                    <span className="text-emerald-900">Current Rate:</span>
                    <strong className="text-emerald-950 font-mono">
                      {billing?.currency || "$"}{amount.toFixed(2)}/{billing?.billingCycle || "mo"}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-200/60">
                    <span className="text-emerald-900">1-Year Savings:</span>
                    <strong className="text-emerald-950 font-mono">
                      {billing?.currency || "$"}{(amount * 12).toFixed(2)}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-1">
                    <span className="font-bold text-emerald-950">5-Year Total Saved:</span>
                    <strong className="text-emerald-700 font-extrabold text-lg sm:text-xl font-display">
                      {billing?.currency || "$"}{bleed.toFixed(2)}
                    </strong>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/90 border border-emerald-200 text-xs text-emerald-900 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>You are fully protected from unexpected recurring charges.</span>
                </div>
              </div>
            </div>

            {/* Navigation Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-[#d0e1ed]/70">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="py-2.5 px-5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0c1b38] flex items-center space-x-1.5 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Step 2</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          COMPLETION CELEBRATION (FULL-WIDTH EXPANSIVE BANNER)
      ═══════════════════════════════════════════════════════════════ */}
      {allComplete && (
        <div className="glass-card p-6 sm:p-7 border-emerald-300/80 bg-linear-to-r from-emerald-50/95 via-white/90 to-blue-50/95 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-left animate-in fade-in duration-300 w-full">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-base sm:text-lg font-bold text-[#0c1b38] font-display">
                  You&apos;re All Set!
                </h4>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                  Protected
                </span>
              </div>
              <p className="text-xs text-[#556987] mt-1 leading-relaxed">
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
              className="px-6 py-3 rounded-full bg-[#1658eb] hover:bg-[#1246c4] text-white font-semibold text-xs sm:text-sm flex items-center space-x-2 transition-all shadow-md cursor-pointer hover:-translate-y-0.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Check Another Subscription</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
