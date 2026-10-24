"use client";

import React, { useState } from "react";
import {
  Check,
  AlertTriangle,
  X,
  Lock,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Compass,
  Maximize2,
  Minimize2,
  CheckCircle2,
  ShieldAlert,
  MousePointerClick,
  ExternalLink,
} from "lucide-react";
import { SubscriptionDefusalResponse } from "@/lib/types";
import type { DestinationNode } from "@/lib/engine/types";
import { AwsSvg } from "./AwsLogo";

interface InAppDefusalWindowProps {
  data?: SubscriptionDefusalResponse | null;
  destination?: DestinationNode | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkCanceled: () => void;
  onDownloadIcs: () => void;
  isCanceled: boolean;
  initialStep?: number;
}

export function InAppDefusalWindow({
  data,
  destination,
  isOpen,
  onClose,
  onMarkCanceled,
  onDownloadIcs,
  isCanceled,
  initialStep = 0,
}: InAppDefusalWindowProps) {
  const merchantName = destination?.providerName || data?.merchant?.name || "Service";
  const rawPortalUrl = destination?.targetUrl || data?.merchant?.directPortalUrl || "";

  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Simulation states for presets (e.g. Lovable modal open, Adobe cancel screen, AWS)
  const [lovableManageModalOpen, setLovableManageModalOpen] = useState(false);
  const [adobeModalOpen, setAdobeModalOpen] = useState(false);
  const [awsModalOpen, setAwsModalOpen] = useState(false);
  const [netflixModalOpen, setNetflixModalOpen] = useState(false);
  const [simulatedActionCompleted, setSimulatedActionCompleted] = useState(isCanceled);

  if (!isOpen) return null;

  const steps = destination?.navigationPath
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
          instruction: `Go to ${merchantName} billing settings page.`,
          decoyWarning: "Do not click on payment method updates or invoice history.",
        },
        {
          stepNumber: 2,
          instruction: "Locate your active plan and find the cancellation or downgrade option.",
          decoyWarning: "Decline any 'Pause' or 'Discount' offers meant to keep billing active.",
        },
        {
          stepNumber: 3,
          instruction: "Confirm the cancellation until you see a final confirmation screen.",
          decoyWarning: "Verify that recurring billing shows as 'Inactive' or 'Canceled'.",
        },
      ];

  const darkPatternTricks =
    destination?.darkPatternWarnings || data?.darkPattern?.tricksExposed || [];

  const currentStep = steps[currentStepIndex] || steps[0];
  const totalSteps = steps.length;
  const progressPercent = Math.round(
    (Object.values(completedSteps).filter(Boolean).length / totalSteps) * 100
  );

  const cleanPortalUrl = () => {
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
      const url = new URL(cleanPortalUrl());
      return url.hostname + (url.pathname.length > 1 ? url.pathname : "");
    } catch {
      return rawPortalUrl || "cancellation page";
    }
  })();

  const toggleStepCompleted = (stepNum: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNum]: !prev[stepNum],
    }));
  };

  const nextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCompletedSteps((prev) => ({ ...prev, [currentStep.stepNumber]: true }));
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setCompletedSteps((prev) => ({ ...prev, [currentStep.stepNumber]: true }));
      setSimulatedActionCompleted(true);
      onMarkCanceled();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Preset identifier checks
  const isLovable =
    merchantName.toLowerCase().includes("lovable") ||
    cleanPortalUrl().includes("lovable.dev");

  const isAdobe =
    merchantName.toLowerCase().includes("adobe") ||
    cleanPortalUrl().includes("adobe.com");

  const isGoogleCloud =
    merchantName.toLowerCase().includes("google") ||
    merchantName.toLowerCase().includes("gcp") ||
    cleanPortalUrl().includes("cloud.google.com");

  const isAws =
    (merchantName.toLowerCase().includes("aws") ||
      merchantName.toLowerCase().includes("amazon") ||
      cleanPortalUrl().includes("aws.amazon.com")) &&
    !isGoogleCloud;

  const isNetflix =
    merchantName.toLowerCase().includes("netflix") ||
    cleanPortalUrl().includes("netflix.com");

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      {/* Main In-App Window Frame */}
      <div
        className={`w-full bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullScreen
            ? "h-full max-w-full"
            : "max-w-340 h-[92vh] max-h-230"
        }`}
      >
        {/* ── Window Title Bar / Browser Chrome ── */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          {/* Mac-style Window Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              title="Close window"
              className="w-3.5 h-3.5 rounded-full bg-rose-500 hover:bg-rose-600 transition flex items-center justify-center group"
            >
              <X className="w-2.5 h-2.5 text-rose-950 opacity-0 group-hover:opacity-100 transition" />
            </button>
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              title="Toggle full size"
              className="w-3.5 h-3.5 rounded-full bg-amber-500 hover:bg-amber-600 transition"
            />
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              title="Expand window"
              className="w-3.5 h-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 transition"
            />
          </div>

          {/* Browser Omnibar / Real Application Tab Launcher */}
          <div className="flex-1 max-w-2xl mx-auto flex items-center justify-center gap-2">
            <div
              onClick={() => window.open(cleanPortalUrl(), "_blank", "noopener,noreferrer")}
              className="w-full bg-slate-900 border border-slate-800 hover:border-blue-500/60 rounded-xl px-3.5 py-1.5 flex items-center justify-between text-xs transition cursor-pointer group shadow-inner"
              title={`Click to open real ${merchantName} portal in a new browser tab`}
            >
              <div className="flex items-center space-x-2 truncate">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-mono text-slate-300 group-hover:text-blue-300 truncate transition">
                  {cleanPortalUrl()}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#1658eb] hover:bg-[#1246c4] text-white flex items-center gap-1 shadow-xs transition">
                  <span>Open Real Tab</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullScreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Main Workspace: Left Guidance Co-Pilot + Right Live Viewport ── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* ═══════════════════════════════════════════════════════════════
              LEFT COLUMN: CO-PILOT GUIDANCE PANEL (5 COLS)
          ═══════════════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-5 bg-slate-900/95 flex flex-col justify-between overflow-y-auto p-5 sm:p-6 space-y-6">
            <div className="space-y-5">
              {/* Co-Pilot Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                    <Compass className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <span>CancelTrap Co-Pilot</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </h3>
                    <p className="text-xs text-slate-400">
                      Guiding you through {merchantName}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
                  Step {currentStepIndex + 1} of {totalSteps}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Defusal Progress</span>
                  <span>{progressPercent}% Complete</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-linear-to-r from-blue-500 to-emerald-400 h-full transition-all duration-300"
                    style={{ width: `${Math.max(progressPercent, 10)}%` }}
                  />
                </div>
              </div>

              {/* Active Step Focus Card */}
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                    <MousePointerClick className="w-3.5 h-3.5 text-blue-400" />
                    <span>Action Required Right Now</span>
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-200">
                    Step {currentStep.stepNumber}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-white font-semibold leading-snug">
                  {currentStep.instruction}
                </p>

                {currentStep.decoyWarning && (
                  <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <strong className="text-rose-300 block font-bold">
                        Decoy Trap Warning:
                      </strong>
                      <span className="leading-relaxed">
                        {currentStep.decoyWarning}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Step Timeline / Checklist */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Full Defusal Route
                </h4>
                <div className="space-y-2">
                  {steps.map((st, idx) => {
                    const isCurrent = idx === currentStepIndex;
                    const isDone = !!completedSteps[st.stepNumber];

                    return (
                      <div
                        key={st.stepNumber}
                        onClick={() => setCurrentStepIndex(idx)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start space-x-3 ${
                          isCurrent
                            ? "bg-slate-800 border-blue-500/60 shadow-md text-white"
                            : isDone
                            ? "bg-slate-900/60 border-slate-800 text-slate-400 opacity-70"
                            : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStepCompleted(st.stepNumber);
                          }}
                          className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-400 transition"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <div className="w-4 h-4 rounded border border-slate-600 flex items-center justify-center font-mono text-[10px]">
                              {st.stepNumber}
                            </div>
                          )}
                        </button>
                        <div className="flex-1 space-y-0.5">
                          <span
                            className={`font-medium line-clamp-2 ${
                              isDone ? "line-through text-slate-500" : ""
                            }`}
                          >
                            {st.instruction}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Known Dark Patterns Callout */}
              {darkPatternTricks && darkPatternTricks.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                  <div className="flex items-center space-x-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Traps CancelTrap Is Bypassing:</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {darkPatternTricks.map((trick, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-amber-400">•</span>
                        <span>{trick}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStepIndex === 0}
                  className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 disabled:opacity-30 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer disabled:cursor-not-allowed active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-illuminate-primary flex-1 py-2.5 px-5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer"
                >
                  <span>
                    {currentStepIndex === totalSteps - 1
                      ? "Finish & Mark Defused ✓"
                      : "Next Step"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={onDownloadIcs}
                  className="text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-1 transition cursor-pointer hover:underline"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Calendar Kill-Switch</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onMarkCanceled();
                    setSimulatedActionCompleted(true);
                    onClose();
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition cursor-pointer hover:underline flex items-center gap-1"
                >
                  <span>{simulatedActionCompleted ? "Defused! (Close)" : "I Canceled Directly"}</span>
                  <span>✓</span>
                </button>
              </div>
            </div>
          </aside>

          {/* ═══════════════════════════════════════════════════════════════
              RIGHT COLUMN: LIVE IN-APP VIEWPORT & INTERACTIVE SIMULATOR (7 COLS)
          ═══════════════════════════════════════════════════════════════ */}
          <main className="lg:col-span-7 bg-slate-950 flex flex-col min-h-0 overflow-y-auto">
            {/* Viewport Top Banner with Real Tab Launcher */}
            <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300 shrink-0">
              <div className="flex items-center space-x-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-white font-bold truncate">
                  {merchantName} &middot; Live Console
                </span>
                <span className="text-slate-400 font-mono text-[11px] hidden sm:inline truncate">
                  ({portalHostname})
                </span>
              </div>

              <button
                type="button"
                onClick={() => window.open(cleanPortalUrl(), "_blank", "noopener,noreferrer")}
                className="px-3.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition cursor-pointer shrink-0"
              >
                <span>Open Real {merchantName} Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Viewport Body */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center relative overflow-y-auto">
              {/* ─────────────────────────────────────────────────────────
                  1. LOVABLE PRO REALISTIC SIMULATOR VIEWPORT
              ───────────────────────────────────────────────────────── */}
              {isLovable ? (
                <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 text-left relative animate-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">Billing &amp; Plans</h2>
                      <p className="text-xs text-slate-400">Manage your subscription, credits, and invoices</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      Active
                    </span>
                  </div>

                  {/* Lovable Pro Subscription Card */}
                  <div className="p-5 rounded-xl bg-slate-850 border border-slate-750 space-y-4 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-base font-bold text-white">Lovable Pro</span>

                        {/* THE INFAMOUS HIDDEN [MANAGE] PILL BUTTON */}
                        <div className="relative inline-block">
                          {/* CancelTrap Target Halo Ring */}
                          <div className="absolute -inset-1 rounded-full bg-blue-500/40 animate-ping pointer-events-none" />
                          <button
                            type="button"
                            onClick={() => {
                              setLovableManageModalOpen(true);
                              setCompletedSteps((prev) => ({ ...prev, 1: true }));
                              setCurrentStepIndex(1);
                            }}
                            className="relative z-10 px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-blue-600 text-white text-[11px] font-semibold border border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.6)] cursor-pointer transition transform hover:scale-105 active:scale-95 flex items-center space-x-1"
                          >
                            <span>Manage</span>
                          </button>
                        </div>
                      </div>

                      <span className="text-sm font-bold text-white">$20.00 / month</span>
                    </div>

                    <p className="text-xs text-slate-400">
                      Renews automatically on Oct 26, 2026. Includes 100 compute credits.
                    </p>

                    {/* Decoy options */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span className="hover:text-slate-300 cursor-pointer">Invoices &amp; receipts</span>
                      <span className="hover:text-slate-300 cursor-pointer">Payment methods (Stripe)</span>
                    </div>
                  </div>

                  {/* Lovable "Manage plan" Modal Overlay when clicked */}
                  {lovableManageModalOpen && (
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm rounded-2xl flex items-center justify-center p-4 z-20 animate-in fade-in duration-200">
                      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white">Manage plan</h3>
                          <button
                            onClick={() => setLovableManageModalOpen(false)}
                            className="text-slate-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed">
                          Your current plan is <strong className="text-white">Lovable Pro</strong> ($20/mo). Choose an action:
                        </p>

                        <div className="space-y-2">
                          <button
                            type="button"
                            className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700 text-left flex items-center justify-between opacity-60"
                          >
                            <span>Upgrade to Scale</span>
                            <span className="text-[10px] text-slate-500">Decoy</span>
                          </button>

                          {/* CancelTrap Target Action: Downgrade to free */}
                          <div className="relative">
                            <div className="absolute -inset-1 rounded-lg bg-emerald-500/30 animate-pulse pointer-events-none" />
                            <button
                              type="button"
                              onClick={() => {
                                setCompletedSteps((prev) => ({
                                  ...prev,
                                  1: true,
                                  2: true,
                                  3: true,
                                }));
                                setCurrentStepIndex(2);
                                setSimulatedActionCompleted(true);
                                onMarkCanceled();
                              }}
                              className="relative z-10 w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold border border-emerald-400 shadow-lg text-left flex items-center justify-between transition cursor-pointer transform hover:scale-[1.02]"
                            >
                              <span>Downgrade to free</span>
                              <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded text-emerald-100">
                                Official Cancellation Trigger ✓
                              </span>
                            </button>
                          </div>
                        </div>

                        <div className="text-[11px] text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                          CancelTrap verified: Lovable intentionally avoids the word &apos;Cancel&apos;. Clicking &apos;Downgrade to free&apos; permanently terminates recurring billing.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Success notification banner inside viewport */}
                  {simulatedActionCompleted && (
                    <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 flex items-center justify-between animate-in zoom-in-95">
                      <div className="flex items-center space-x-2">
                        <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div>
                          <strong className="block text-xs font-bold">
                            Lovable Pro Defused Successfully!
                          </strong>
                          <span className="text-[11px] text-emerald-300">
                            Your subscription will not renew. $240/year saved.
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={onClose}
                        className="px-3 py-1 rounded bg-emerald-600 text-white text-xs font-semibold"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>
              ) : isAdobe ? (
                /* ─────────────────────────────────────────────────────────
                   2. ADOBE CREATIVE CLOUD REALISTIC SIMULATOR
                ───────────────────────────────────────────────────────── */
                <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 text-left relative animate-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white text-sm">
                        Ps
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">Adobe Account &middot; Plans</h2>
                        <p className="text-xs text-slate-400">Creative Cloud All Apps (Annual Plan)</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-400">
                      $54.99 / mo
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">Plan Management</span>
                      <div className="relative">
                        <div className="absolute -inset-1 rounded-lg bg-blue-500/40 animate-ping pointer-events-none" />
                        <button
                          type="button"
                          onClick={() => {
                            setAdobeModalOpen(true);
                            setCompletedSteps((prev) => ({ ...prev, 1: true }));
                            setCurrentStepIndex(1);
                          }}
                          className="relative z-10 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer transition transform hover:scale-105"
                        >
                          Manage plan
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">
                      Includes 20+ desktop apps, 100GB cloud storage, Adobe Fonts, and Firefly generative credits.
                    </p>
                  </div>

                  {/* Adobe Early Cancellation Fee Trap Modal */}
                  {adobeModalOpen && (
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm rounded-2xl flex items-center justify-center p-4 z-20 animate-in fade-in">
                      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white">Cancel Creative Cloud Plan</h3>
                          <button onClick={() => setAdobeModalOpen(false)} className="text-slate-400 hover:text-white">
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs space-y-1">
                          <strong className="block text-rose-300 font-bold">⚠️ Early Cancellation Fee: $164.97</strong>
                          <span>Your annual contract has 6 months remaining. Adobe charges a 50% early termination fee.</span>
                        </div>

                        <div className="space-y-2">
                          <button
                            type="button"
                            className="w-full py-2 px-3 rounded-lg bg-slate-800 text-slate-400 text-xs border border-slate-700 text-left flex items-center justify-between opacity-60"
                          >
                            <span>Keep plan with 2 months free credit</span>
                            <span className="text-[10px] text-slate-500">Decoy</span>
                          </button>

                          {/* CancelTrap Target Defusal Action */}
                          <div className="relative">
                            <div className="absolute -inset-1 rounded-lg bg-emerald-500/35 animate-pulse pointer-events-none" />
                            <button
                              type="button"
                              onClick={() => {
                                setCompletedSteps((prev) => ({ ...prev, 1: true, 2: true, 3: true }));
                                setCurrentStepIndex(2);
                                setSimulatedActionCompleted(true);
                                onMarkCanceled();
                              }}
                              className="relative z-10 w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold border border-emerald-400 shadow-lg text-left flex items-center justify-between transition cursor-pointer transform hover:scale-[1.02]"
                            >
                              <span>Dodge $165 Fee &amp; Cancel Directly</span>
                              <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded text-emerald-100">
                                Defusal Trigger ✓
                              </span>
                            </button>
                          </div>
                        </div>

                        <div className="text-[11px] text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                          CancelTrap verified: Switching to Photography plan grants a 14-day free cancellation window, zeroing out the $165 fee.
                        </div>
                      </div>
                    </div>
                  )}

                  {simulatedActionCompleted && (
                    <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 flex items-center justify-between animate-in zoom-in-95">
                      <div className="flex items-center space-x-2">
                        <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div>
                          <strong className="block text-xs font-bold">Adobe Annual Trap Neutralized!</strong>
                          <span className="text-[11px] text-emerald-300">Dodged $164.97 penalty fee. Subscription canceled.</span>
                        </div>
                      </div>
                      <button onClick={onClose} className="px-3 py-1 rounded bg-emerald-600 text-white text-xs font-semibold">Done</button>
                    </div>
                  )}
                </div>
              ) : isAws ? (
                /* ─────────────────────────────────────────────────────────
                   3. AWS BILLING CONSOLE FULL-FIDELITY LIVE TAB VIEWPORT
                ───────────────────────────────────────────────────────── */
                <div className="w-full h-full min-h-130 bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl flex flex-col text-left overflow-hidden relative animate-in zoom-in-95">
                  {/* Real AWS Management Console Chrome Header */}
                  <div className="bg-[#131921] px-4 py-2 border-b border-black flex items-center justify-between text-white shrink-0 select-none">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-5 flex items-center justify-center shrink-0">
                        <AwsSvg className="w-7 h-7" onDark={true} />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-200 font-semibold px-2 py-1 rounded hover:bg-slate-800 cursor-pointer">
                        <div className="w-3.5 h-3.5 grid grid-cols-2 gap-0.5">
                          <div className="bg-white rounded-[1px]" />
                          <div className="bg-white rounded-[1px]" />
                          <div className="bg-white rounded-[1px]" />
                          <div className="bg-white rounded-[1px]" />
                        </div>
                        <span>Services</span>
                      </div>
                    </div>

                    <div className="flex-1 max-w-sm mx-4 hidden md:block">
                      <div className="bg-[#232f3e] border border-slate-700/80 rounded px-2.5 py-1 text-slate-400 text-xs flex items-center gap-2">
                        <span>Search [Alt+S]</span>
                        <span className="text-slate-500 text-[11px] ml-auto">Billing</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-slate-300">
                      <span className="hidden sm:inline font-mono text-[11px] bg-slate-800/80 px-2 py-0.5 rounded text-amber-300">
                        us-east-1 (N. Virginia)
                      </span>
                      <span className="font-semibold text-white bg-slate-850 px-2 py-1 rounded border border-slate-700 text-[11px]">
                        Root Account @ 4829-1092-3810
                      </span>
                    </div>
                  </div>

                  {/* AWS Breadcrumb Subnav */}
                  <div className="bg-[#232f3e] px-4 py-1.5 text-[11px] text-slate-400 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      AWS Management Console &gt; Billing and Cost Management &gt; <strong className="text-white">Subscriptions</strong>
                    </div>
                    <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Live Console Environment
                    </span>
                  </div>

                  {/* Real Application Tab Launcher Banner */}
                  <div className="p-3.5 bg-blue-950/60 border-b border-blue-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-200">
                    <div className="flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <strong className="block text-white">Target Live URL: https://console.aws.amazon.com/billing/home</strong>
                        <span className="text-blue-300/80 text-[11px]">Cancel directly below or launch the real AWS tab in your browser.</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => window.open(cleanPortalUrl(), "_blank", "noopener,noreferrer")}
                      className="px-4 py-2 rounded-xl bg-[#ff9900] hover:bg-[#e08800] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer shrink-0"
                    >
                      <span>Open Real AWS Tab ↗</span>
                    </button>
                  </div>

                  {/* AWS Console Body: Left Nav + Content */}
                  <div className="flex-1 flex overflow-hidden">
                    {/* Left AWS Sidebar */}
                    <aside className="w-48 bg-[#1b2533] border-r border-slate-800 p-3 space-y-1 text-xs text-slate-300 shrink-0 hidden md:block select-none">
                      <div className="font-bold text-[11px] text-slate-400 uppercase tracking-wider px-2 py-1">
                        Billing &amp; Cost Mgmt
                      </div>
                      <div className="px-2.5 py-1.5 rounded hover:bg-slate-800 text-slate-400 cursor-pointer">
                        Billing Dashboard
                      </div>
                      <div className="px-2.5 py-1.5 rounded hover:bg-slate-800 text-slate-400 cursor-pointer">
                        Bills &amp; Expenses
                      </div>
                      <div className="px-2.5 py-1.5 rounded hover:bg-slate-800 text-slate-400 cursor-pointer">
                        Cost Explorer
                      </div>
                      <div className="px-2.5 py-1.5 rounded bg-blue-600/30 text-blue-300 font-bold border border-blue-500/40 cursor-pointer flex items-center justify-between">
                        <span>Subscriptions</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      </div>
                      <div className="px-2.5 py-1.5 rounded hover:bg-slate-800 text-slate-400 cursor-pointer">
                        Account Settings
                      </div>
                    </aside>

                    {/* Main AWS Management Canvas */}
                    <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-left">
                      {/* Active Subscriptions Card & Table */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <div>
                            <h3 className="font-bold text-white text-sm sm:text-base">
                              Active AWS Marketplace &amp; Developer Subscriptions
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                              1 recurring subscription linked to Root Account (4829-1092-3810)
                            </p>
                          </div>
                          <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Active
                          </span>
                        </div>

                        {/* Subscription Detail Table */}
                        <div className="border border-slate-800 rounded-lg overflow-hidden divide-y divide-slate-800 text-xs">
                          <div className="bg-slate-850 px-3.5 py-2 font-semibold text-slate-400 grid grid-cols-12 gap-2">
                            <span className="col-span-5">Subscription Item</span>
                            <span className="col-span-3">Billing Cycle</span>
                            <span className="col-span-2">Rate</span>
                            <span className="col-span-2 text-right">Action</span>
                          </div>
                          <div className="px-3.5 py-3 grid grid-cols-12 gap-2 items-center hover:bg-slate-850/60 transition">
                            <div className="col-span-5 font-semibold text-white">
                              <div>Developer Support &amp; Marketplace SaaS</div>
                              <span className="text-[11px] text-slate-400">AWS Marketplace Purchase #MP-98124</span>
                            </div>
                            <div className="col-span-3 text-slate-300">
                              Monthly Recurring &middot; Auto-Renew
                            </div>
                            <div className="col-span-2 font-bold text-emerald-400">
                              $100.00 / mo
                            </div>
                            <div className="col-span-2 text-right">
                              {/* Cancel Subscription Target Action */}
                              <div className="relative inline-block">
                                <div className="absolute -inset-1 rounded-lg bg-blue-500/40 animate-ping pointer-events-none" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAwsModalOpen(true);
                                    setCompletedSteps((prev) => ({ ...prev, 1: true }));
                                    setCurrentStepIndex(1);
                                  }}
                                  className="relative z-10 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md active:scale-95 transition cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Direct cancellation guidance notice */}
                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                          <div>
                            <strong>Decoy Warning:</strong> Stopping EC2 instances does NOT cancel marketplace SaaS subscriptions. You must confirm termination under Marketplace Subscriptions.
                          </div>
                        </div>
                      </div>

                      {/* Fallback Root Account Closure Card */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 flex items-center justify-between">
                        <div>
                          <strong className="text-slate-300 block">Need to close the entire AWS account?</strong>
                          <span>Navigate to Account Settings &gt; Close Account as the Root User.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => window.open("https://console.aws.amazon.com/billing/home#/account", "_blank", "noopener,noreferrer")}
                          className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition"
                        >
                          Account Closure ↗
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* AWS Cancel Confirmation Dialog Overlay */}
                  {awsModalOpen && (
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm rounded-2xl flex items-center justify-center p-4 z-30 animate-in fade-in">
                      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 text-left">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-rose-400" />
                            <span>Confirm Termination of AWS Subscription</span>
                          </h3>
                          <button onClick={() => setAwsModalOpen(false)} className="text-slate-400 hover:text-white">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Terminating recurring billing will immediately stop all monthly charges for <strong className="text-white">Developer Support &amp; Marketplace SaaS</strong> on your account.
                        </p>
                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                          ✓ CancelTrap Verified Path: Official cancellation endpoint terminates auto-renew cleanly.
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setCompletedSteps((prev) => ({ ...prev, 1: true, 2: true, 3: true }));
                              setCurrentStepIndex(2);
                              setSimulatedActionCompleted(true);
                              onMarkCanceled();
                            }}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition cursor-pointer text-center"
                          >
                            Confirm Termination &amp; Stop Billing ✓
                          </button>
                          <button
                            type="button"
                            onClick={() => window.open(cleanPortalUrl(), "_blank", "noopener,noreferrer")}
                            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                            title="Open in real AWS tab"
                          >
                            Open Real Tab ↗
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Defused Confirmation */}
                  {simulatedActionCompleted && (
                    <div className="p-4 bg-emerald-500/20 border-t border-emerald-500/40 text-emerald-200 flex items-center justify-between animate-in zoom-in-95">
                      <div className="flex items-center space-x-2">
                        <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div>
                          <strong className="block text-xs font-bold">AWS Subscription Defused Successfully!</strong>
                          <span className="text-[11px] text-emerald-300">Recurring billing stopped. No further charges will accrue.</span>
                        </div>
                      </div>
                      <button onClick={onClose} className="px-3.5 py-1 rounded bg-emerald-600 text-white text-xs font-semibold cursor-pointer">Done</button>
                    </div>
                  )}
                </div>
              ) : isGoogleCloud ? (
                /* ─────────────────────────────────────────────────────────
                   3B. GOOGLE CLOUD FULL-FIDELITY LIVE TAB VIEWPORT
                ───────────────────────────────────────────────────────── */
                <div className="w-full h-full min-h-130 bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl flex flex-col text-left overflow-hidden relative animate-in zoom-in-95">
                  <div className="bg-[#1a73e8] px-4 py-2 border-b border-blue-600 flex items-center justify-between text-white shrink-0">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-sm tracking-tight">Google Cloud Console</span>
                      <span className="text-xs bg-blue-700 px-2 py-0.5 rounded font-mono">My First Project (stellar-orbit-412)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => window.open(cleanPortalUrl(), "_blank", "noopener,noreferrer")}
                      className="px-3 py-1 rounded bg-white text-blue-700 font-bold text-xs flex items-center gap-1 shadow cursor-pointer"
                    >
                      <span>Real Tab ↗</span>
                    </button>
                  </div>

                  <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <h3 className="font-bold text-white text-base">Billing Account Overview</h3>
                          <p className="text-xs text-slate-400">Account ID: 01A492-9C8E41-B83A01</p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Active Account
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-850">
                          <span className="text-xs text-slate-300 font-semibold">Active Subscriptions &amp; Linked Projects</span>
                          <button
                            type="button"
                            onClick={() => {
                              setCompletedSteps((prev) => ({ ...prev, 1: true, 2: true, 3: true }));
                              setSimulatedActionCompleted(true);
                              onMarkCanceled();
                            }}
                            className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow"
                          >
                            Disable Auto-Renewal / Close Billing
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : isNetflix ? (
                /* ─────────────────────────────────────────────────────────
                   4. NETFLIX ACCOUNT REALISTIC SIMULATOR
                ───────────────────────────────────────────────────────── */
                <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 text-left relative animate-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white text-xs">
                        NETFLIX
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">Netflix &middot; Account &amp; Billing</h2>
                        <p className="text-xs text-slate-400">Premium Plan &middot; 4K HDR</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      $22.99 / mo
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">Membership Status</span>
                      <div className="relative">
                        <div className="absolute -inset-1 rounded-lg bg-blue-500/40 animate-ping pointer-events-none" />
                        <button
                          type="button"
                          onClick={() => {
                            setNetflixModalOpen(true);
                            setCompletedSteps((prev) => ({ ...prev, 1: true }));
                            setCurrentStepIndex(1);
                          }}
                          className="relative z-10 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-white text-xs font-bold border border-slate-700 shadow-md cursor-pointer transition transform hover:scale-105"
                        >
                          Cancel Membership
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">
                      Next billing date is in 4 days. Includes 4 concurrent streams and spatial audio.
                    </p>
                  </div>

                  {netflixModalOpen && (
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm rounded-2xl flex items-center justify-center p-4 z-20 animate-in fade-in">
                      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white">Cancel Membership</h3>
                          <button onClick={() => setNetflixModalOpen(false)} className="text-slate-400 hover:text-white">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-300">
                          Click below to confirm. Decline Netflix&apos;s &quot;Pause Plan&quot; retention decoy.
                        </p>
                        <div className="space-y-2">
                          <button type="button" className="w-full py-2 px-3 rounded-lg bg-slate-800 text-slate-400 text-xs border border-slate-700 text-left flex items-center justify-between opacity-60">
                            <span>Pause for 1 month instead</span>
                            <span className="text-[10px] text-slate-500">Decoy</span>
                          </button>
                          <div className="relative">
                            <div className="absolute -inset-1 rounded-lg bg-emerald-500/35 animate-pulse pointer-events-none" />
                            <button
                              type="button"
                              onClick={() => {
                                setCompletedSteps((prev) => ({ ...prev, 1: true, 2: true, 3: true }));
                                setCurrentStepIndex(2);
                                setSimulatedActionCompleted(true);
                                onMarkCanceled();
                              }}
                              className="relative z-10 w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold text-center block shadow transition cursor-pointer"
                            >
                              Finish Cancellation (Decline Pause) ✓
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {simulatedActionCompleted && (
                    <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 flex items-center justify-between animate-in zoom-in-95">
                      <div className="flex items-center space-x-2">
                        <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div>
                          <strong className="block text-xs font-bold">Netflix Membership Canceled!</strong>
                          <span className="text-[11px] text-emerald-300">You will have access until the end of your billing cycle.</span>
                        </div>
                      </div>
                      <button onClick={onClose} className="px-3 py-1 rounded bg-emerald-600 text-white text-xs font-semibold">Done</button>
                    </div>
                  )}
                </div>
              ) : (
                /* ─────────────────────────────────────────────────────────
                   5. GENERIC PORTAL INTERACTIVE EMBED
                ───────────────────────────────────────────────────────── */
                <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 text-left animate-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {merchantName} &middot; Subscription Settings
                      </h3>
                      <p className="text-xs text-slate-400">
                        Target Page: {cleanPortalUrl()}
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                      Guided Mode
                    </span>
                  </div>

                  {/* Active Guided Step in the viewport */}
                  <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-bold text-blue-400">
                      <MousePointerClick className="w-4 h-4 text-blue-400" />
                      <span>Follow Step {currentStepIndex + 1} Below</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 font-medium">
                      {currentStep.instruction}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCompletedSteps((prev) => ({
                            ...prev,
                            [currentStep.stepNumber]: true,
                          }));
                          if (currentStepIndex < totalSteps - 1) {
                            setCurrentStepIndex((prev) => prev + 1);
                          } else {
                            setSimulatedActionCompleted(true);
                            onMarkCanceled();
                          }
                        }}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow transition cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>I Completed This Step</span>
                      </button>
                    </div>
                  </div>

                  {/* Dark Pattern Alert Callout */}
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-amber-300 font-bold">
                        Keep this window side-by-side:
                      </strong>
                      <span>
                        Our guidance steps on the left stay active while you confirm cancellation. Do not close this until you see the final confirmation!
                      </span>
                    </div>
                  </div>

                  {/* External URL card */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-center text-xs text-slate-500">
                    <span>
                      External portal: <strong className="text-slate-400">{portalHostname}</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
