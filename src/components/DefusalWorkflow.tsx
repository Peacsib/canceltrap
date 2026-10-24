"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Calendar,
  Check,
  ShieldCheck,
  Clock,
  Ban,
  Sparkles,
  Download,
  RotateCcw,
  Lock,
} from "lucide-react";
import { SubscriptionDefusalResponse } from "@/lib/types";
import { downloadKillSwitchIcs } from "@/lib/calendar";

interface DefusalWorkflowProps {
  data: SubscriptionDefusalResponse;
  onReset: () => void;
}

export function DefusalWorkflow({ data, onReset }: DefusalWorkflowProps) {
  const { merchant, billing, defusalChecklist, killSwitch } = data;

  // Workflow completion states
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Individual trap evasion check states
  const [checkedTraps, setCheckedTraps] = useState<Record<number, boolean>>({});

  // Helper for direct portal URL
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
      return merchant?.directPortalUrl || "cancellation portal";
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
    setActiveStep(2);
  };

  const toggleTrap = (idx: number) => {
    setCheckedTraps((prev) => {
      const next = { ...prev, [idx]: !prev[idx] };
      const allChecked =
        defusalChecklist.length > 0 &&
        defusalChecklist.every((_, i) => !!next[i]);
      if (allChecked) {
        setStep2Done(true);
        setActiveStep(3);
      }
      return next;
    });
  };

  const handleCompleteStep2 = () => {
    setStep2Done(true);
    const all: Record<number, boolean> = {};
    defusalChecklist.forEach((_, i) => (all[i] = true));
    setCheckedTraps(all);
    setActiveStep(3);
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

  // Progress metrics
  const completedCount =
    (step1Done ? 1 : 0) + (step2Done ? 1 : 0) + (step3Done ? 1 : 0);
  const progressPercent = Math.round((completedCount / 3) * 100);
  const allComplete = completedCount === 3;

  return (
    <div className="w-full space-y-6">
      {/* ─── Top Workflow Pipeline Bar ─── */}
      <div className="glass-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Pipeline Steps Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Step 1 Pill */}
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              step1Done
                ? activeStep === 1
                  ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30"
                  : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                : activeStep === 1
                ? "bg-[#11338a] text-white shadow-sm ring-2 ring-[#11338a]/20"
                : "bg-white/80 text-[#54657a] hover:bg-white"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step1Done
                  ? activeStep === 1
                    ? "bg-white text-emerald-700"
                    : "bg-emerald-600 text-white"
                  : activeStep === 1
                  ? "bg-white text-[#11338a]"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {step1Done ? "✓" : "1"}
            </span>
            <span>Launch Bypass</span>
          </button>

          <span className="text-slate-300 font-bold hidden sm:inline">→</span>

          {/* Step 2 Pill */}
          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              step2Done
                ? activeStep === 2
                  ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30"
                  : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                : activeStep === 2
                ? "bg-[#11338a] text-white shadow-sm ring-2 ring-[#11338a]/20"
                : "bg-white/80 text-[#54657a] hover:bg-white"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step2Done
                  ? activeStep === 2
                    ? "bg-white text-emerald-700"
                    : "bg-emerald-600 text-white"
                  : activeStep === 2
                  ? "bg-white text-[#11338a]"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {step2Done ? "✓" : "2"}
            </span>
            <span>Evade Decoys</span>
          </button>

          <span className="text-slate-300 font-bold hidden sm:inline">→</span>

          {/* Step 3 Pill */}
          <button
            type="button"
            onClick={() => setActiveStep(3)}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              step3Done
                ? activeStep === 3
                  ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30"
                  : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                : activeStep === 3
                ? "bg-[#11338a] text-white shadow-sm ring-2 ring-[#11338a]/20"
                : "bg-white/80 text-[#54657a] hover:bg-white"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step3Done
                  ? activeStep === 3
                    ? "bg-white text-emerald-700"
                    : "bg-emerald-600 text-white"
                  : activeStep === 3
                  ? "bg-white text-[#11338a]"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {step3Done ? "✓" : "3"}
            </span>
            <span>Arm Kill-Switch</span>
          </button>
        </div>

        {/* Progress status */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-right">
            <span className="text-xs font-bold text-[#0f1e3b]">
              {completedCount} of 3 Defused
            </span>
            <div className="w-32 h-1.5 bg-slate-200/80 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-[#11338a] to-[#54b66e] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3-Step Interactive Workflow Pipeline Cards ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* ════════════════════════════════════════
            STEP 1: DIRECT PORTAL BYPASS
        ════════════════════════════════════════ */}
        <div
          onClick={() => setActiveStep(1)}
          className={`glass-card p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden text-left cursor-pointer ${
            activeStep === 1
              ? "ring-2 ring-[#11338a]/40 shadow-lg scale-[1.01]"
              : step1Done
              ? "border-emerald-200/80 bg-emerald-50/20"
              : "opacity-95 hover:border-slate-300"
          }`}
        >
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  step1Done
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-blue-100 text-[#11338a]"
                }`}
              >
                Step 01 &middot; Direct Link
              </span>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  step1Done
                    ? "bg-emerald-500 text-white"
                    : "bg-blue-100 text-[#11338a]"
                }`}
              >
                {step1Done ? (
                  <Check className="w-4 h-4 stroke-3" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#0f1e3b] font-display">
              Launch Portal
            </h3>
            <p className="text-xs text-[#54657a] mt-1 leading-relaxed">
              Bypasses hidden settings and deep-links straight to plan
              management.
            </p>

            {/* Target URL Pill */}
            <div className="mt-4 p-2.5 rounded-xl bg-white/70 border border-[#d0e1ed] flex items-center space-x-2 text-xs text-[#0f1e3b]">
              <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate font-mono text-[11px]">
                {portalHostname}
              </span>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-6 pt-4 border-t border-[#d0e1ed]/60">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenPortal();
              }}
              className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                step1Done
                  ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 shadow-sm"
                  : "btn-primary shadow-md"
              }`}
            >
              {step1Done ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-3 text-emerald-700" />
                  <span>Portal Opened &middot; Relaunch ↗</span>
                </>
              ) : (
                <>
                  <span>Open Portal Directly</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════
            STEP 2: DISARM DECOY SCREENS
        ════════════════════════════════════════ */}
        <div
          onClick={() => setActiveStep(2)}
          className={`glass-card p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden text-left cursor-pointer ${
            activeStep === 2
              ? "ring-2 ring-[#11338a]/40 shadow-lg scale-[1.01]"
              : step2Done
              ? "border-emerald-200/80 bg-emerald-50/20"
              : "opacity-95 hover:border-slate-300"
          }`}
        >
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  step2Done
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-900"
                }`}
              >
                Step 02 &middot; Evade Traps
              </span>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  step2Done
                    ? "bg-emerald-500 text-white"
                    : "bg-amber-100 text-[#eab532]"
                }`}
              >
                {step2Done ? (
                  <Check className="w-4 h-4 stroke-3" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                )}
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#0f1e3b] font-display">
              Bypass Decoys
            </h3>
            <p className="text-xs text-[#54657a] mt-1 leading-relaxed">
              Dodge misleading buttons designed to trap you into staying.
            </p>

            {/* Visual Decoy vs Action Badges */}
            <div className="mt-4 space-y-2">
              {defusalChecklist.slice(0, 3).map((item, idx) => {
                const isChecked = !!checkedTraps[idx];
                return (
                  <div
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTrap(idx);
                    }}
                    className={`p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-start space-x-2.5 ${
                      isChecked
                        ? "bg-emerald-50/80 border-emerald-300 text-[#0f1e3b]"
                        : "bg-white/70 border-[#d0e1ed] hover:border-[#11338a]/40"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 text-[10px] font-bold transition-all ${
                        isChecked
                          ? "bg-emerald-600 text-white"
                          : "border border-slate-300 bg-white"
                      }`}
                    >
                      {isChecked && "✓"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#0f1e3b] leading-tight truncate">
                        {item.instruction}
                      </p>
                      {item.decoyWarning && (
                        <p className="text-[11px] text-amber-800 font-semibold mt-1 flex items-center space-x-1">
                          <Ban className="w-3 h-3 text-[#df202e] shrink-0" />
                          <span className="truncate">{item.decoyWarning}</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action button */}
          <div className="mt-6 pt-4 border-t border-[#d0e1ed]/60">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCompleteStep2();
              }}
              className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                step2Done
                  ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 shadow-sm"
                  : "btn-primary shadow-md"
              }`}
            >
              {step2Done ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-3 text-emerald-700" />
                  <span>Decoys Bypassed &middot; Verified ✓</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 stroke-2" />
                  <span>Mark Decoys Evaded</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════
            STEP 3: ARM CALENDAR KILL-SWITCH
        ════════════════════════════════════════ */}
        <div
          onClick={() => setActiveStep(3)}
          className={`glass-card p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden text-left cursor-pointer ${
            activeStep === 3
              ? "ring-2 ring-[#11338a]/40 shadow-lg scale-[1.01]"
              : step3Done
              ? "border-emerald-200/80 bg-emerald-50/20"
              : "opacity-95 hover:border-slate-300"
          }`}
        >
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  step3Done
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-blue-100 text-[#11338a]"
                }`}
              >
                Step 03 &middot; Renewal Lock
              </span>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  step3Done
                    ? "bg-emerald-500 text-white"
                    : "bg-blue-100 text-[#11338a]"
                }`}
              >
                {step3Done ? (
                  <Check className="w-4 h-4 stroke-3" />
                ) : (
                  <Calendar className="w-4 h-4" />
                )}
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#0f1e3b] font-display">
              Arm Cutoff Alert
            </h3>
            <p className="text-xs text-[#54657a] mt-1 leading-relaxed">
              Schedules a calibrated calendar alert before your auto-renewal
              cutoff.
            </p>

            {/* Alert Time Pill */}
            <div className="mt-4 p-3 rounded-xl bg-white/70 border border-[#d0e1ed] space-y-1">
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#0f1e3b]">
                <Clock className="w-3.5 h-3.5 text-[#11338a]" />
                <span>{formatAlertDate(killSwitch?.suggestedAlertDate)}</span>
              </div>
              <p className="text-[11px] text-[#54657a]">
                Fires 2 hours before cutoff &middot; Includes portal bypass link
              </p>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-6 pt-4 border-t border-[#d0e1ed]/60">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadIcs();
              }}
              className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                step3Done
                  ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 shadow-sm"
                  : "btn-primary shadow-md"
              }`}
            >
              {step3Done ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-3 text-emerald-700" />
                  <span>Kill-Switch Downloaded (.ics)</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Kill-Switch (.ics)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Celebratory Completion State ─── */}
      {allComplete && (
        <div className="glass-card p-6 border-emerald-300/80 bg-linear-to-r from-emerald-50/90 via-white/80 to-blue-50/90 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-left animate-in fade-in duration-300">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#0f1e3b] font-display">
                Subscription Defusal Complete!
              </h4>
              <p className="text-xs text-[#54657a] mt-0.5">
                You bypassed the retention maze and armed your calendar
                kill-switch. Estimated 5-year savings:{" "}
                <strong className="text-emerald-700">
                  {billing?.currency || "$"}
                  {Number(billing?.vampireBleed5Year ?? 0).toFixed(2)}
                </strong>
                .
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="px-5 py-2.5 rounded-xl bg-[#11338a] hover:bg-[#1640ad] text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-sm shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Scan Another Receipt</span>
          </button>
        </div>
      )}
    </div>
  );
}
