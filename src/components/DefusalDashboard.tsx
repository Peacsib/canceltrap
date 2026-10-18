"use client";

import React from "react";
import Image from "next/image";
import { Shield, RotateCcw, CheckCircle2 } from "lucide-react";
import { SubscriptionDefusalResponse } from "@/lib/types";
import { MetricsGrid } from "./MetricsGrid";
import { DefusalChecklist } from "./DefusalChecklist";
import { ActionHub } from "./ActionHub";

interface DefusalDashboardProps {
  data: SubscriptionDefusalResponse;
  onReset: () => void;
}

export function DefusalDashboard({ data, onReset }: DefusalDashboardProps) {
  return (
    <div className="min-h-screen w-full px-6 sm:px-12 lg:px-20 py-8 relative">
      {/* Top Header Navbar */}
      <header className="max-w-7xl mx-auto flex items-center justify-between pb-6 mb-8 border-b border-[#d0e1ed]/70">
        <div className="flex items-center space-x-4">
          <Image
            src="/canceltrap-logo.png"
            alt="CancelTrap Logo"
            width={180}
            height={45}
            className="h-10 w-auto object-contain"
          />
          <div className="border-l border-[#d0e1ed] pl-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-[#54b66e]" />
                <span>Defusal Active</span>
              </span>
            </div>
            <p className="text-xs text-[#54657a] mt-0.5">
              Target: <strong>{data.merchant.name}</strong> ({data.merchant.category})
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#d0e1ed] text-[#0f1e3b] font-semibold text-xs flex items-center space-x-2 transition-all shadow-sm hover:border-[#11338a]/50 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#54657a]" />
          <span>New Scan</span>
        </button>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        {/* Top 4 Metrics Cards */}
        <MetricsGrid data={data} />

        {/* Dual Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column (2 cols): Step-by-Step Defusal Action Plan */}
          <div className="lg:col-span-2 w-full">
            <DefusalChecklist data={data} />
          </div>

          {/* Right Column (1 col): Action Hub with Direct Portal & Kill-Switch */}
          <div className="lg:col-span-1 w-full">
            <ActionHub data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
