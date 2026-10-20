"use client";

import React from "react";
import Image from "next/image";
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import { SubscriptionDefusalResponse } from "@/lib/types";
import { InteractiveDefusalWizard } from "./InteractiveDefusalWizard";

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
      <header className="w-full max-w-[1400px] mx-auto flex items-center justify-between pb-5 mb-6 border-b border-[#d0e1ed]/70">
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
            <span>Ready to Cancel</span>
          </span>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onReset}
          className="px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white border border-[#d0e1ed] text-[#0f1e3b] font-semibold text-xs flex items-center space-x-1.5 transition-all shadow-sm hover:border-[#11338a]/50 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#54657a]" />
          <span>Check Another</span>
        </button>
      </header>

      {/* ─── Main Content Container (Full Width) ─── */}
      <main className="w-full max-w-[1400px] mx-auto space-y-6">
        {/* ─── Plain-English Summary Ribbon ─── */}
        <div className="glass-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
          {/* Target Service Badge */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#11338a] flex items-center justify-center font-bold text-base shrink-0 shadow-sm border border-blue-200/50">
              {merchant?.name?.charAt(0) || "S"}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-[#0f1e3b] font-display">
                  {merchant?.name || "Subscription"}
                </h2>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-[#54657a] border border-slate-200">
                  {merchant?.category || "Service"}
                </span>
              </div>
              <p className="text-xs text-[#54657a] mt-0.5">
                Cancellation details found from your receipt
              </p>
            </div>
          </div>

          {/* Micro-Metrics Strip (Simple, Plain-English) */}
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
                <strong>Renews in {days} days</strong> ({formatRenewalDate(billing?.renewalDate)})
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
                /{billing?.billingCycle || "month"}
              </span>
            </div>

            {/* 3. 5-Year Savings Pill */}
            <div className="px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 text-emerald-800 text-xs flex items-center space-x-1.5 font-semibold">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                ${bleed.toFixed(0)} saved over 5 years
              </span>
            </div>

            {/* 4. Trap Warning Pill */}
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

        {/* ─── Simple 3-Step Cancellation Guide ─── */}
        <InteractiveDefusalWizard data={data} onReset={onReset} />
      </main>
    </div>
  );
}
