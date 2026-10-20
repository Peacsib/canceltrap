"use client";

import React from "react";
import Image from "next/image";
import {
  Shield,
  RotateCcw,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import { SubscriptionDefusalResponse } from "@/lib/types";
import { InteractiveWorkflowGraph } from "./InteractiveWorkflowGraph";

interface DefusalDashboardProps {
  data: SubscriptionDefusalResponse;
  onReset: () => void;
}

export function DefusalDashboard({ data, onReset }: DefusalDashboardProps) {
  const { merchant, billing, darkPattern } = data;

  // Format renewal countdown
  const days = billing?.daysUntilRenewal ?? 3;
  const isUrgent = days <= 3;

  const formatRenewalDate = (dateStr?: string) => {
    if (!dateStr) return "Upcoming cycle";
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
  };

  const amount = Number(billing?.amount ?? 0);
  const bleed = Number(billing?.vampireBleed5Year ?? amount * 60);

  return (
    <div className="min-h-screen w-full px-4 sm:px-8 lg:px-16 py-6 sm:py-8 relative">
      {/* ─── Top Header Navbar ─── */}
      <header className="max-w-6xl mx-auto flex items-center justify-between pb-5 mb-6 border-b border-[#d0e1ed]/70">
        {/* Brand Logo Capsule */}
        <div className="flex items-center space-x-3">
          <div className="inline-flex items-center justify-center bg-white/70 backdrop-blur-xl border border-white/80 rounded-full px-4 py-1.5 shadow-[0_4px_16px_-4px_rgba(31,85,150,0.15)] ring-1 ring-black/5">
            <Image
              src="/canceltrap-logo.png"
              alt="CancelTrap"
              width={130}
              height={32}
              priority
              className="h-6 w-auto object-contain"
            />
          </div>

          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100/90 text-emerald-800 font-semibold flex items-center space-x-1 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Defusal Active</span>
          </span>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onReset}
          className="px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white border border-[#d0e1ed] text-[#0f1e3b] font-semibold text-xs flex items-center space-x-1.5 transition-all shadow-sm hover:border-[#11338a]/50 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#54657a]" />
          <span>New Scan</span>
        </button>
      </header>

      {/* ─── Main Content Container ─── */}
      <main className="max-w-6xl mx-auto space-y-6">
        {/* ─── Compact Glassy Summary Ribbon (Less text, high signal) ─── */}
        <div className="glass-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
          {/* Target Service Badge */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#11338a] flex items-center justify-center font-bold text-base shrink-0 shadow-sm border border-blue-200/50">
              {merchant?.name?.charAt(0) || "S"}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-[#0f1e3b] font-display">
                  {merchant?.name || "Target Subscription"}
                </h2>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-[#54657a] border border-slate-200">
                  {merchant?.category || "Service"}
                </span>
              </div>
              <p className="text-xs text-[#54657a] mt-0.5">
                Identified from receipt analysis &middot; Verified cancellation
                path
              </p>
            </div>
          </div>

          {/* Micro-Metrics Strip (4 punchy pills instead of 4 giant boxes) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* 1. Countdown Pill */}
            <div
              className={`px-3 py-1.5 rounded-xl border text-xs flex items-center space-x-1.5 ${
                isUrgent
                  ? "bg-red-50 text-[#df202e] border-red-200 font-semibold"
                  : "bg-white/80 text-[#0f1e3b] border-[#d0e1ed]"
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>
                <strong>{days}d left</strong> ({formatRenewalDate(billing?.renewalDate)})
              </span>
            </div>

            {/* 2. Billing Rate Pill */}
            <div className="px-3 py-1.5 rounded-xl border border-[#d0e1ed] bg-white/80 text-[#0f1e3b] text-xs flex items-center space-x-1.5">
              <DollarSign className="w-3.5 h-3.5 text-slate-500" />
              <span>
                <strong>
                  {billing?.currency || "$"}
                  {amount.toFixed(2)}
                </strong>
                /{billing?.billingCycle || "mo"}
              </span>
            </div>

            {/* 3. 5-Year Bleed Risk Pill */}
            <div className="px-3 py-1.5 rounded-xl border border-red-200 bg-red-50/70 text-[#df202e] text-xs flex items-center space-x-1.5 font-semibold">
              <TrendingDown className="w-3.5 h-3.5 text-[#df202e]" />
              <span>
                ${bleed.toFixed(0)} 5-yr bleed
              </span>
            </div>

            {/* 4. Dark Pattern Tag */}
            {darkPattern?.patternType && (
              <div className="px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-900 text-xs flex items-center space-x-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span className="truncate max-w-[140px] sm:max-w-[180px]">
                  {darkPattern.patternType}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ─── Interactive Workflow Neural Graph (Visual, Dynamic, Engaging) ─── */}
        <InteractiveWorkflowGraph data={data} onReset={onReset} />
      </main>
    </div>
  );
}
