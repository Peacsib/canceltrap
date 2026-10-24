"use client";

import React from "react";
import { Clock, DollarSign, TrendingDown, ShieldAlert } from "lucide-react";
import { SubscriptionDefusalResponse } from "@/lib/types";

interface MetricsGridProps {
  data: SubscriptionDefusalResponse;
}

export function MetricsGrid({ data }: MetricsGridProps) {
  const { billing, darkPattern } = data;

  // Format renewal countdown
  const days = billing?.daysUntilRenewal ?? 3;
  const isUnknown = days === -1;
  const isUrgent = !isUnknown && days <= 3;

  const formatRenewalDate = (dateStr?: string) => {
    if (!dateStr) return "Upcoming cycle";
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  const amount = Number(billing?.amount ?? 0);
  const bleed = Number(billing?.vampireBleed5Year ?? amount * 60);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-8">
      {/* 1. Renewal Countdown */}
      <div className="glass-card p-5 relative overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#54657a]">
            Renewal Countdown
          </span>
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isUrgent ? "bg-red-100 text-[#df202e]" : "bg-blue-100 text-[#11338a]"
            }`}
          >
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-2">
          {isUnknown ? (
            <span className="text-lg font-bold text-[#54657a] leading-tight">
              See billing page
            </span>
          ) : (
            <span
              className={`text-3xl font-extrabold font-display ${
                isUrgent ? "text-[#df202e]" : "text-[#0f1e3b]"
              }`}
            >
              {days} {days === 1 ? "Day" : "Days"}
            </span>
          )}
          {!isUnknown && <span className="text-xs font-medium text-[#54657a]">remaining</span>}
        </div>

        <p className="text-xs text-[#54657a] mt-2 truncate">
          {isUnknown
            ? "Your real date is on your billing portal"
            : `Target deadline: ${formatRenewalDate(billing?.renewalDate)}`}
        </p>
      </div>

      {/* 2. Billing Rate */}
      <div className="glass-card p-5 relative overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#54657a]">
            Current Rate
          </span>
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#11338a] flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-1.5">
          <span className="text-3xl font-extrabold text-[#0f1e3b] font-display">
            {billing?.currency || "$"}{amount.toFixed(2)}
          </span>
          <span className="text-xs font-medium text-[#54657a]">
            / {billing?.billingCycle || "cycle"}
          </span>
        </div>

        <p className="text-xs text-[#54657a] mt-2">
          Auto-renews automatically
        </p>
      </div>

      {/* 3. 5-Year Vampire Bleed */}
      <div className="glass-card p-5 relative overflow-hidden transition-all hover:shadow-md border-red-200/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#df202e]">
            5-Year Vampire Bleed
          </span>
          <div className="w-7 h-7 rounded-lg bg-red-100 text-[#df202e] flex items-center justify-center">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-1.5">
          <span className="text-3xl font-extrabold text-[#df202e] font-display">
            {billing?.currency || "$"}
            {bleed.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <p className="text-xs text-[#df202e]/80 mt-2 font-medium">
          Drained if uncancelled over 60 months
        </p>
      </div>

      {/* 4. Dark Pattern Identified */}
      <div className="glass-card p-5 relative overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#54657a]">
            Trap Detected
          </span>
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-[#eab532] flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>

        <h3 className="text-base font-bold text-[#0f1e3b] font-display line-clamp-1">
          {darkPattern?.patternType || "Deceptive Retention Trap"}
        </h3>

        <div className="mt-2 flex items-center space-x-1.5">
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${
              darkPattern?.severity === "critical"
                ? "bg-red-100 text-[#df202e]"
                : darkPattern?.severity === "warning"
                ? "bg-amber-100 text-[#eab532]"
                : "bg-blue-100 text-[#11338a]"
            }`}
          >
            {darkPattern?.severity || "warning"} severity
          </span>
        </div>
      </div>
    </div>
  );
}
