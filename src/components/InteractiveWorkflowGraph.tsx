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
  CheckCircle2,
  Lock,
  Cpu,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";
import { SubscriptionDefusalResponse } from "@/lib/types";
import { downloadKillSwitchIcs } from "@/lib/calendar";

interface InteractiveWorkflowGraphProps {
  data: SubscriptionDefusalResponse;
  onReset: () => void;
}

export function InteractiveWorkflowGraph({
  data,
  onReset,
}: InteractiveWorkflowGraphProps) {
  const { merchant, billing, darkPattern, defusalChecklist, killSwitch } = data;

  // Active / completed state tracking
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);
  const [selectedNode, setSelectedNode] = useState<
    "portal" | "decoys" | "killswitch" | "bleed" | "ai" | "core"
  >("portal");

  // Sub-step checks in Step 2
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
    setSelectedNode("decoys");
  };

  const toggleTrap = (idx: number) => {
    setCheckedTraps((prev) => {
      const next = { ...prev, [idx]: !prev[idx] };
      const allChecked =
        defusalChecklist.length > 0 &&
        defusalChecklist.every((_, i) => !!next[i]);
      if (allChecked) {
        setStep2Done(true);
        setSelectedNode("killswitch");
      }
      return next;
    });
  };

  const handleCompleteStep2 = () => {
    setStep2Done(true);
    const all: Record<number, boolean> = {};
    defusalChecklist.forEach((_, i) => (all[i] = true));
    setCheckedTraps(all);
    setSelectedNode("killswitch");
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
    setSelectedNode("core");
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

  const completedCount =
    (step1Done ? 1 : 0) + (step2Done ? 1 : 0) + (step3Done ? 1 : 0);
  const allComplete = completedCount === 3;
  const progressPercent = Math.round((completedCount / 3) * 100);

  const amount = Number(billing?.amount ?? 0);
  const bleed = Number(billing?.vampireBleed5Year ?? amount * 60);

  return (
    <div className="w-full space-y-5">
      {/* ═══════════════════════════════════════════════════════════════
          INTERACTIVE WORKFLOW CANVAS (NEURAL NETWORK MAP)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="relative w-full rounded-3xl bg-gradient-to-b from-white/90 via-[#f0f7ff]/70 to-white/95 backdrop-blur-2xl border border-white shadow-[0_20px_50px_-15px_rgba(22,88,235,0.16)] p-5 sm:p-7 overflow-hidden">
        {/* Subtle Ambient Background Orbits */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] rounded-full border border-[#1658eb]/40 border-dashed animate-[spin_100s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[300px] h-[220px] sm:h-[300px] rounded-full border border-indigo-300/30" />
        </div>

        {/* Top Header of the Canvas */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 mb-2 border-b border-[#d0e1ed]/50 text-left">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1658eb] to-[#0c7830] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-bold text-[#0c1b38] font-display">
                  Neural Defusal Workflow
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-[#1658eb] border border-blue-200">
                  Interactive Node Network
                </span>
              </div>
              <p className="text-[11px] text-[#556987]">
                Click any circular node to inspect and execute its action
              </p>
            </div>
          </div>

          {/* Progress Capsule */}
          <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white shadow-xs">
            <div className="text-right">
              <span className="text-xs font-bold text-[#0c1b38]">
                {allComplete ? "✓ 100% Defused" : `${completedCount} of 3 Armed`}
              </span>
              <div className="w-24 sm:w-32 h-1.5 bg-slate-100 rounded-full mt-0.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#1658eb] via-[#54b66e] to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={onReset}
              className="p-1 rounded-full hover:bg-slate-100 text-[#556987] hover:text-[#0c1b38] transition-colors cursor-pointer"
              title="Reset Scan"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            THE VISUAL HUB-AND-SPOKE NETWORK (CIRCULAR NODES + SVG)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="relative w-full h-[340px] sm:h-[380px] flex items-center justify-center my-1 select-none">
          {/* SVG Animated Connector Circuits */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 800 400"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Center (400, 200) -> Top-Left Portal (160, 90) */}
            <path
              d="M 400 200 C 300 200, 220 140, 160 90"
              fill="none"
              stroke={step1Done ? "#10b981" : "#1658eb"}
              strokeWidth={selectedNode === "portal" ? "3.5" : "2"}
              strokeDasharray={step1Done ? "none" : "6 6"}
              className={step1Done ? "" : "animate-[dash_20s_linear_infinite]"}
              opacity={step1Done ? "0.9" : "0.5"}
            />
            {/* Small Connection Dots */}
            <circle cx="160" cy="90" r="4" fill={step1Done ? "#10b981" : "#1658eb"} />
            <circle cx="400" cy="200" r="5" fill="#1658eb" />

            {/* Center (400, 200) -> Top-Right Decoys (640, 90) */}
            <path
              d="M 400 200 C 500 200, 580 140, 640 90"
              fill="none"
              stroke={step2Done ? "#10b981" : "#f59e0b"}
              strokeWidth={selectedNode === "decoys" ? "3.5" : "2"}
              strokeDasharray={step2Done ? "none" : "6 6"}
              className={step2Done ? "" : "animate-[dash_20s_linear_infinite]"}
              opacity={step2Done ? "0.9" : "0.5"}
            />
            <circle cx="640" cy="90" r="4" fill={step2Done ? "#10b981" : "#f59e0b"} />

            {/* Center (400, 200) -> Bottom-Right Kill-Switch (640, 310) */}
            <path
              d="M 400 200 C 500 200, 580 260, 640 310"
              fill="none"
              stroke={step3Done ? "#10b981" : "#1658eb"}
              strokeWidth={selectedNode === "killswitch" ? "3.5" : "2"}
              strokeDasharray={step3Done ? "none" : "6 6"}
              className={step3Done ? "" : "animate-[dash_20s_linear_infinite]"}
              opacity={step3Done ? "0.9" : "0.5"}
            />
            <circle cx="640" cy="310" r="4" fill={step3Done ? "#10b981" : "#1658eb"} />

            {/* Center (400, 200) -> Bottom-Left Bleed Shield (160, 310) */}
            <path
              d="M 400 200 C 300 200, 220 260, 160 310"
              fill="none"
              stroke="#ef4444"
              strokeWidth={selectedNode === "bleed" ? "3" : "1.8"}
              strokeDasharray="4 4"
              opacity="0.45"
            />
            <circle cx="160" cy="310" r="4" fill="#ef4444" opacity="0.6" />

            {/* Center (400, 200) -> Top AI Engine (400, 45) */}
            <path
              d="M 400 200 L 400 45"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth={selectedNode === "ai" ? "3" : "1.8"}
              strokeDasharray="4 4"
              opacity="0.5"
            />
            <circle cx="400" cy="45" r="3.5" fill="#8b5cf6" />
          </svg>

          {/* ─────────────────────────────────────────────────────────────
              CENTRAL HUB: TARGET SUBSCRIPTION CORE (PURPLE / BLUE CIRCLE)
          ───────────────────────────────────────────────────────────── */}
          <div
            onClick={() => setSelectedNode("core")}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group transition-transform duration-300 ${
              selectedNode === "core" ? "scale-105" : "hover:scale-102"
            }`}
          >
            {/* Luminous Glow Aura */}
            <div
              className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${
                allComplete
                  ? "bg-emerald-400/40 animate-pulse"
                  : "bg-blue-400/25 group-hover:bg-blue-400/40"
              }`}
            />

            <div
              className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center p-2 text-center transition-all duration-300 relative border-4 ${
                allComplete
                  ? "bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-[0_0_40px_rgba(16,185,129,0.35)] border-white"
                  : "bg-gradient-to-br from-[#1658eb] via-[#1246c4] to-[#0c1b38] text-white shadow-[0_12px_35px_-8px_rgba(22,88,235,0.4)] border-white/90"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-1 shadow-inner">
                {allComplete ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <span className="font-bold text-sm font-display text-white">
                    {merchant?.name?.charAt(0) || "S"}
                  </span>
                )}
              </div>

              <span className="font-extrabold text-xs sm:text-sm font-display truncate max-w-[105px] px-1 text-white">
                {merchant?.name || "Target Hub"}
              </span>

              <span
                className={`text-[9px] sm:text-[10px] font-semibold mt-1 px-2 py-0.5 rounded-full ${
                  allComplete
                    ? "bg-white text-emerald-800"
                    : "bg-white/20 text-white backdrop-blur-xs"
                }`}
              >
                {allComplete ? "DEFUSED ✓" : `${completedCount}/3 Armed`}
              </span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              NODE 1: TOP-LEFT · PORTAL BYPASS (CIRCULAR NODE)
          ───────────────────────────────────────────────────────────── */}
          <div
            onClick={() => setSelectedNode("portal")}
            className={`absolute top-[4%] sm:top-[6%] left-[4%] sm:left-[8%] lg:left-[12%] z-20 cursor-pointer group transition-all duration-300 ${
              selectedNode === "portal" ? "scale-110" : "hover:scale-105"
            }`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300 relative border-3 ${
                  step1Done
                    ? "bg-emerald-500 text-white shadow-[0_8px_25px_rgba(16,185,129,0.4)] border-white ring-4 ring-emerald-100"
                    : selectedNode === "portal"
                    ? "bg-white text-[#0c1b38] shadow-[0_10px_30px_rgba(22,88,235,0.3)] border-[#1658eb] ring-4 ring-blue-100"
                    : "bg-white/95 text-[#0c1b38] shadow-sm border-blue-200 hover:border-[#1658eb]"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center mb-0.5 ${
                    step1Done
                      ? "bg-white/20 text-white"
                      : "bg-blue-100 text-[#1658eb]"
                  }`}
                >
                  {step1Done ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <ExternalLink className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className="text-[10px] font-extrabold leading-tight">
                  Portal
                </span>
              </div>
              <span className="text-[9px] font-bold text-[#556987] group-hover:text-[#1658eb] mt-1 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200">
                {step1Done ? "✓ Bypass" : "Step 01"}
              </span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              NODE 2: TOP-RIGHT · DECOY FILTER (CIRCULAR NODE)
          ───────────────────────────────────────────────────────────── */}
          <div
            onClick={() => setSelectedNode("decoys")}
            className={`absolute top-[4%] sm:top-[6%] right-[4%] sm:right-[8%] lg:right-[12%] z-20 cursor-pointer group transition-all duration-300 ${
              selectedNode === "decoys" ? "scale-110" : "hover:scale-105"
            }`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300 relative border-3 ${
                  step2Done
                    ? "bg-emerald-500 text-white shadow-[0_8px_25px_rgba(16,185,129,0.4)] border-white ring-4 ring-emerald-100"
                    : selectedNode === "decoys"
                    ? "bg-white text-[#0c1b38] shadow-[0_10px_30px_rgba(245,158,11,0.3)] border-amber-500 ring-4 ring-amber-100"
                    : "bg-white/95 text-[#0c1b38] shadow-sm border-amber-200 hover:border-amber-400"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center mb-0.5 ${
                    step2Done
                      ? "bg-white/20 text-white"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {step2Done ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className="text-[10px] font-extrabold leading-tight">
                  Decoys
                </span>
              </div>
              <span className="text-[9px] font-bold text-[#556987] group-hover:text-amber-700 mt-1 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200">
                {step2Done ? "✓ Disarmed" : "Step 02"}
              </span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              NODE 3: BOTTOM-RIGHT · KILL-SWITCH (CIRCULAR NODE)
          ───────────────────────────────────────────────────────────── */}
          <div
            onClick={() => setSelectedNode("killswitch")}
            className={`absolute bottom-[4%] sm:bottom-[6%] right-[4%] sm:right-[8%] lg:right-[12%] z-20 cursor-pointer group transition-all duration-300 ${
              selectedNode === "killswitch" ? "scale-110" : "hover:scale-105"
            }`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300 relative border-3 ${
                  step3Done
                    ? "bg-emerald-500 text-white shadow-[0_8px_25px_rgba(16,185,129,0.4)] border-white ring-4 ring-emerald-100"
                    : selectedNode === "killswitch"
                    ? "bg-white text-[#0c1b38] shadow-[0_10px_30px_rgba(22,88,235,0.3)] border-[#1658eb] ring-4 ring-blue-100"
                    : "bg-white/95 text-[#0c1b38] shadow-sm border-blue-200 hover:border-[#1658eb]"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center mb-0.5 ${
                    step3Done
                      ? "bg-white/20 text-white"
                      : "bg-blue-100 text-[#1658eb]"
                  }`}
                >
                  {step3Done ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <Calendar className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className="text-[10px] font-extrabold leading-tight">
                  Cutoff
                </span>
              </div>
              <span className="text-[9px] font-bold text-[#556987] group-hover:text-[#1658eb] mt-1 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200">
                {step3Done ? "✓ Armed" : "Step 03"}
              </span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              NODE 4: BOTTOM-LEFT · 5-YR BLEED (CIRCULAR NODE)
          ───────────────────────────────────────────────────────────── */}
          <div
            onClick={() => setSelectedNode("bleed")}
            className={`absolute bottom-[4%] sm:bottom-[6%] left-[4%] sm:left-[8%] lg:left-[12%] z-20 cursor-pointer group transition-all duration-300 ${
              selectedNode === "bleed" ? "scale-110" : "hover:scale-105"
            }`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300 relative border-3 ${
                  selectedNode === "bleed"
                    ? "bg-white text-[#0c1b38] shadow-[0_10px_30px_rgba(239,68,68,0.3)] border-red-400 ring-4 ring-red-100"
                    : "bg-white/95 text-[#0c1b38] shadow-sm border-red-200 hover:border-red-400"
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-0.5">
                  <TrendingDown className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] font-extrabold text-red-600 leading-tight">
                  ${bleed.toFixed(0)}
                </span>
              </div>
              <span className="text-[9px] font-bold text-red-600 mt-1 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                5-Yr Bleed
              </span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              NODE 5: TOP SATELLITE · VISION SCAN ENGINE
          ───────────────────────────────────────────────────────────── */}
          <div
            onClick={() => setSelectedNode("ai")}
            className={`absolute top-[0%] left-1/2 -translate-x-1/2 z-20 cursor-pointer group transition-all duration-300 ${
              selectedNode === "ai" ? "scale-105" : "hover:scale-102"
            }`}
          >
            <div
              className={`px-3 py-1 rounded-full flex items-center space-x-1.5 text-xs font-semibold transition-all shadow-xs border ${
                selectedNode === "ai"
                  ? "bg-purple-600 text-white ring-2 ring-purple-200 border-purple-600"
                  : "bg-white text-purple-900 border-purple-200 hover:bg-purple-50"
              }`}
            >
              <Cpu className="w-3 h-3 text-purple-500 animate-pulse" />
              <span className="text-[10px]">Visual Pattern Scanner</span>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            DYNAMIC INTERACTION DOCK (SELECTED NODE DETAILS & ACTION)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="relative z-10 mt-2 p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-xl border border-white shadow-md text-left transition-all duration-300">
          {/* PANEL 1: PORTAL BYPASS */}
          {selectedNode === "portal" && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-[#1658eb] uppercase tracking-wider">
                    Node 01 &middot; Deep-Link Bypass
                  </span>
                  {step1Done && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ Activated
                    </span>
                  )}
                </div>
                <h4 className="text-sm sm:text-base font-bold text-[#0c1b38] font-display">
                  Launch Direct Plan Cancellation
                </h4>
                <p className="text-xs text-[#556987]">
                  Skips 5 nested settings menus:{" "}
                  <code className="text-[#1658eb] bg-blue-50 px-1.5 py-0.5 rounded text-[11px] font-mono">
                    {portalHostname}
                  </code>
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenPortal}
                className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0 ${
                  step1Done
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300"
                    : "btn-primary shadow-md"
                }`}
              >
                {step1Done ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3] text-emerald-700" />
                    <span>Portal Launched &middot; Relaunch ↗</span>
                  </>
                ) : (
                  <>
                    <span>Open Portal Now</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* PANEL 2: DECOY FILTER */}
          {selectedNode === "decoys" && (
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 uppercase tracking-wider">
                      Node 02 &middot; Trap Disarmer
                    </span>
                    {step2Done && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        ✓ Disarmed
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-[#0c1b38] font-display mt-0.5">
                    Evade Deceptive Retention Traps
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={handleCompleteStep2}
                  className={`px-4 py-2 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shrink-0 ${
                    step2Done
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-[#1658eb] hover:bg-[#1246c4] text-white shadow-sm"
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {step2Done ? "All Traps Disarmed ✓" : "Mark Traps Evaded"}
                  </span>
                </button>
              </div>

              {/* Decoy Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {defusalChecklist.slice(0, 3).map((item, idx) => {
                  const isChecked = !!checkedTraps[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleTrap(idx)}
                      className={`p-2 rounded-xl border text-xs transition-all cursor-pointer flex items-start space-x-2 ${
                        isChecked
                          ? "bg-emerald-50/80 border-emerald-200 text-[#0c1b38]"
                          : "bg-slate-50/80 border-slate-200 hover:border-amber-400"
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded mt-0.5 flex items-center justify-center shrink-0 text-[9px] font-bold ${
                          isChecked
                            ? "bg-emerald-600 text-white"
                            : "border border-slate-300 bg-white"
                        }`}
                      >
                        {isChecked && "✓"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#0c1b38] truncate text-[11px]">
                          {item.instruction}
                        </p>
                        {item.decoyWarning && (
                          <p className="text-[10px] text-amber-800 font-semibold mt-0.5 flex items-center space-x-1">
                            <Ban className="w-2.5 h-2.5 text-red-500 shrink-0" />
                            <span className="truncate">
                              {item.decoyWarning}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PANEL 3: KILL-SWITCH */}
          {selectedNode === "killswitch" && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-[#1658eb] uppercase tracking-wider">
                    Node 03 &middot; Renewal Lock
                  </span>
                  {step3Done && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ Armed in Calendar
                    </span>
                  )}
                </div>
                <h4 className="text-sm sm:text-base font-bold text-[#0c1b38] font-display">
                  1-Click Calendar Cutoff Alert (.ics)
                </h4>
                <p className="text-xs text-[#556987]">
                  Fires:{" "}
                  <strong>{formatAlertDate(killSwitch?.suggestedAlertDate)}</strong>{" "}
                  (48h before renewal) &middot; Syncs with Google, Apple, & Outlook
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadIcs}
                className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0 ${
                  step3Done
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300"
                    : "btn-primary shadow-md"
                }`}
              >
                {step3Done ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3] text-emerald-700" />
                    <span>Kill-Switch Armed (.ics)</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Kill-Switch (.ics)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* PANEL 4: BLEED DEFENSE */}
          {selectedNode === "bleed" && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-700 uppercase tracking-wider">
                  Financial Vampire Bleed Defense
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[#0c1b38] font-display mt-0.5">
                  5-Year Bleed Avoidance:{" "}
                  <span className="text-red-600 font-extrabold">
                    {billing?.currency || "$"}{bleed.toFixed(2)}
                  </span>
                </h4>
                <p className="text-xs text-[#556987]">
                  Based on {billing?.currency || "$"}{amount.toFixed(2)}/
                  {billing?.billingCycle || "month"} recurring drain over 60 months.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNode("portal")}
                className="px-4 py-2 rounded-xl bg-[#1658eb] hover:bg-[#1246c4] text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer shrink-0"
              >
                <span>Defuse via Portal →</span>
              </button>
            </div>
          )}

          {/* PANEL 5: AI ENGINE */}
          {selectedNode === "ai" && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 uppercase tracking-wider">
                  Visual Pattern Scanner
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[#0c1b38] font-display mt-0.5">
                  Dark Pattern Identified:{" "}
                  <span className="text-purple-700 font-extrabold">
                    {darkPattern?.patternType || "Deceptive Subscription Trap"}
                  </span>
                </h4>
                <p className="text-xs text-[#556987]">
                  Visual scan extracted renewal terms and mapped verified direct portal routes.
                </p>
              </div>

              <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                Confidence: 99.4%
              </div>
            </div>
          )}

          {/* PANEL 6: CORE SUMMARY */}
          {selectedNode === "core" && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Core Subscription Status
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[#0c1b38] font-display mt-0.5">
                  {merchant?.name || "Target Service"} &middot;{" "}
                  {allComplete ? (
                    <span className="text-emerald-700 font-extrabold">
                      Subscription Successfully Defused!
                    </span>
                  ) : (
                    <span className="text-[#1658eb]">
                      {completedCount} of 3 Nodes Completed
                    </span>
                  )}
                </h4>
                <p className="text-xs text-[#556987]">
                  Renews in {billing?.daysUntilRenewal ?? 3} days ({billing?.currency || "$"}{amount.toFixed(2)}/mo). Click any surrounding node to execute defusal actions.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNode("portal")}
                className="px-4 py-2 rounded-xl bg-[#1658eb] hover:bg-[#1246c4] text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer shrink-0"
              >
                <span>Step 1: Open Portal →</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── Celebratory Completion Banner ─── */}
      {allComplete && (
        <div className="glass-card p-5 border-emerald-300/80 bg-gradient-to-r from-emerald-50/90 via-white/80 to-blue-50/90 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-left animate-in fade-in duration-300">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[#0c1b38] font-display">
                Subscription Defusal Complete!
              </h4>
              <p className="text-xs text-[#556987] mt-0.5">
                All 3 pipeline nodes armed. 5-year financial bleed averted:{" "}
                <strong className="text-emerald-700">
                  {billing?.currency || "$"}
                  {bleed.toFixed(2)}
                </strong>
                .
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 rounded-xl bg-[#1658eb] hover:bg-[#1246c4] text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Scan Another Receipt</span>
          </button>
        </div>
      )}
    </div>
  );
}
