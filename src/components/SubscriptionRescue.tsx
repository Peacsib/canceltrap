"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ExternalLink,
  Calendar,
  Check,
  Clock,
  Sparkles,
  Download,
  RotateCcw,
  CheckCircle2,
  Lock,
  Building2,
  DollarSign,
  AlertTriangle,
  TrendingDown,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";
import { SubscriptionDefusalResponse } from "@/lib/types";
import { downloadKillSwitchIcs } from "@/lib/calendar";

interface SubscriptionRescueProps {
  data: SubscriptionDefusalResponse;
  onReset: () => void;
}

export function SubscriptionRescue({ data, onReset }: SubscriptionRescueProps) {
  const { merchant, billing, darkPattern, killSwitch } = data;

  const [portalOpened, setPortalOpened] = useState(false);
  const [markedCanceled, setMarkedCanceled] = useState(false);
  const [reminderAdded, setReminderAdded] = useState(false);

  const amount = Number(billing?.amount ?? 0);
  const bleed = Number(billing?.vampireBleed5Year ?? amount * 60);
  const days = billing?.daysUntilRenewal ?? 3;

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
    setPortalOpened(true);
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
    setReminderAdded(true);
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

  const isSuccess = markedCanceled || portalOpened;

  return (
    <div className="min-h-screen w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-8 relative">
      {/* ─── Top Header Navbar ─── */}
      <header className="w-full max-w-[1400px] mx-auto flex items-center justify-between pb-5 mb-8 border-b border-[#d0e1ed]/70">
        {/* Brand Logo Capsule */}
        <div className="flex items-center space-x-3">
          <div className="inline-flex items-center justify-center bg-white/80 backdrop-blur-xl border border-white/90 rounded-full px-4 py-1.5 shadow-[0_4px_16px_-4px_rgba(31,85,150,0.15)] ring-1 ring-black/5">
            <Image
              src="/canceltrap-logo.png"
              alt="CancelTrap"
              width={130}
              height={32}
              priority
              className="h-6 w-auto object-contain"
            />
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center space-x-1.5 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>10-Second Subscription Rescue</span>
          </span>
        </div>

        {/* Check Another Button */}
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-1.5 rounded-full bg-white/80 hover:bg-white border border-[#d0e1ed] text-[#0f1e3b] font-semibold text-xs flex items-center space-x-1.5 transition-all shadow-xs hover:border-[#1658eb]/50 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#54657a]" />
          <span>Check Another Subscription</span>
        </button>
      </header>

      {/* ─── Main Content Container (Full Width, Expansive) ─── */}
      <main className="w-full max-w-[1400px] mx-auto space-y-8 text-left">
        {/* ═══════════════════════════════════════════════════════════════
            SECTION 1: THE QUICK SCAN RESULTS (3 SIMPLE, CLEAR CARDS)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-blue-100 text-[#1658eb] tracking-wider">
              Scan Complete
            </span>
            <span className="text-xs text-[#556987]">
              Here is what CancelTrap found from your screenshot:
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {/* Card 1: 🏢 Company Found */}
            <div className="glass-card p-6 rounded-3xl border border-white shadow-[0_15px_35px_-10px_rgba(22,88,235,0.12)] flex flex-col justify-between space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#556987] uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-[#1658eb]" />
                <span>Company Found</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0c1b38] font-display">
                  {merchant?.name || "Subscription"}
                </h3>
                <span className="inline-block mt-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-[#556987]">
                  {merchant?.category || "Service"}
                </span>
              </div>

              <p className="text-xs text-[#556987] pt-2 border-t border-slate-100">
                Verified official subscription account
              </p>
            </div>

            {/* Card 2: 💰 Amount at Risk */}
            <div className="glass-card p-6 rounded-3xl border border-white shadow-[0_15px_35px_-10px_rgba(22,88,235,0.12)] flex flex-col justify-between space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#556987] uppercase tracking-wider">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Amount at Risk</span>
              </div>

              <div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#0c1b38] font-display">
                    {billing?.currency || "$"}{amount.toFixed(2)}
                  </span>
                  <span className="text-xs font-medium text-[#556987]">
                    / {billing?.billingCycle || "month"}
                  </span>
                </div>

                <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                  Renews in {days} {days === 1 ? "day" : "days"}
                </span>
              </div>

              <p className="text-xs text-emerald-800 font-semibold pt-2 border-t border-slate-100 flex items-center space-x-1">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                <span>${bleed.toFixed(0)} saved over 5 years if canceled</span>
              </p>
            </div>

            {/* Card 3: ⚠️ What We Found */}
            <div className="glass-card p-6 rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50/70 via-white/80 to-amber-50/40 shadow-[0_15px_35px_-10px_rgba(234,179,8,0.15)] flex flex-col justify-between space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Why You Were Stuck</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-[#0c1b38]">
                  {darkPattern?.patternType || "Hidden Cancel Process"}
                </h4>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  {darkPattern?.summary ||
                    "The cancel button is hidden behind extra steps, misleading menus, and retention surveys."}
                </p>
              </div>

              <p className="text-xs font-semibold text-emerald-700 pt-2 border-t border-amber-200/60">
                ✓ Relief: We found the direct link to bypass this below.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 2: TAKING ACTION (2 CLEAR, EASY-TO-READ ACTIONS)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-[#1658eb] text-white tracking-wider">
              Take Action
            </span>
            <span className="text-xs text-[#556987]">
              Choose how you want to take care of this right now:
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* ACTION 1: THE DIRECT LINK (7 COLS) */}
            <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl border-2 border-[#1658eb]/30 bg-gradient-to-br from-white/95 via-blue-50/40 to-white/95 shadow-[0_20px_50px_-15px_rgba(22,88,235,0.18)] flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-blue-100 text-[#1658eb] tracking-wider">
                    Recommended &middot; 10-Second Fix
                  </span>
                  {portalOpened && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Link Opened</span>
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-extrabold text-[#0c1b38] font-display">
                  Open Direct Cancel Link
                </h3>

                <p className="text-xs sm:text-sm text-[#556987] leading-relaxed">
                  Click the button below to jump straight to{" "}
                  <strong>{merchant?.name}&apos;s</strong> hidden cancellation
                  page. It skips all the confusing account settings menus and
                  exit surveys so you can cancel in one click.
                </p>

                <div className="p-3.5 rounded-2xl bg-white border border-[#d0e1ed] flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-[#1658eb] font-mono font-semibold truncate">
                    <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">https://{portalHostname}</span>
                  </div>
                  <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-[#556987] shrink-0 hidden sm:inline">
                    Official Website
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenPortal}
                  className="py-3.5 px-8 rounded-full font-bold text-sm bg-[#1658eb] hover:bg-[#1246c4] text-white shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Open Direct Cancel Link</span>
                  <ExternalLink className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setMarkedCanceled(true)}
                  className={`py-3 px-6 rounded-full font-semibold text-xs transition-all cursor-pointer border flex items-center justify-center space-x-1.5 ${
                    markedCanceled
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : "bg-white hover:bg-slate-50 text-[#0c1b38] border-[#d0e1ed]"
                  }`}
                >
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>
                    {markedCanceled ? "Marked as Canceled ✓" : "I Canceled on Their Site"}
                  </span>
                </button>
              </div>
            </div>

            {/* ACTION 2: THE REMINDER (5 COLS) */}
            <div className="lg:col-span-5 glass-card p-6 sm:p-8 rounded-3xl border border-white shadow-[0_15px_35px_-10px_rgba(22,88,235,0.12)] flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-slate-100 text-[#556987] tracking-wider">
                  Peace of Mind
                </span>

                <h3 className="text-xl font-bold text-[#0c1b38] font-display">
                  Set a Reminder
                </h3>

                <p className="text-xs text-[#556987] leading-relaxed">
                  If you want to keep using the trial for a few more days, add
                  an automated reminder to your calendar 2 days before the
                  renewal cutoff so you never forget.
                </p>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center space-x-2 font-semibold text-[#0c1b38]">
                    <Clock className="w-4 h-4 text-[#1658eb]" />
                    <span>
                      Alert:{" "}
                      <strong>{formatAlertDate(killSwitch?.suggestedAlertDate)}</strong>
                    </span>
                  </div>
                  <p className="text-[11px] text-[#556987]">
                    Includes the direct cancel link right inside the calendar event.
                  </p>
                </div>
              </div>

              {/* Download Calendar Button */}
              <button
                type="button"
                onClick={handleDownloadIcs}
                className={`w-full py-3 px-6 rounded-full font-semibold text-xs sm:text-sm transition-all cursor-pointer border flex items-center justify-center space-x-2 ${
                  reminderAdded
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : "bg-white hover:bg-slate-50 text-[#0c1b38] border-slate-300 shadow-xs"
                }`}
              >
                {reminderAdded ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3] text-emerald-600" />
                    <span>Reminder Added to Calendar ✓</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 text-[#1658eb]" />
                    <span>Add Reminder to Calendar (.ics)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3: THE SUCCESS (CHEERFUL GREEN RELIEF BANNER)
        ═══════════════════════════════════════════════════════════════ */}
        {isSuccess && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-2 border-emerald-400 bg-gradient-to-r from-emerald-50 via-white to-teal-50 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-left animate-in fade-in zoom-in-95 duration-300 w-full">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-7 h-7 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-lg sm:text-xl font-extrabold text-[#0c1b38] font-display">
                    Subscription Canceled Successfully!
                  </h4>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                    Money Saved
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#556987] leading-relaxed">
                  You just saved money from unwanted charges! You dodged{" "}
                  <strong className="text-emerald-700 font-extrabold">
                    {billing?.currency || "$"}{amount.toFixed(2)}/month
                  </strong>{" "}
                  and protected{" "}
                  <strong className="text-emerald-700 font-extrabold">
                    {billing?.currency || "$"}{bleed.toFixed(2)}
                  </strong>{" "}
                  over 5 years.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onReset}
              className="py-3 px-6 rounded-full bg-[#1658eb] hover:bg-[#1246c4] text-white font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 cursor-pointer hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Rescue Another Subscription</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
