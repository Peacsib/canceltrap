"use client";

import React, { useState } from "react";
import { ExternalLink, Calendar, Check, Download, Info, ShieldAlert } from "lucide-react";
import { SubscriptionDefusalResponse } from "@/lib/types";
import { downloadKillSwitchIcs } from "@/lib/calendar";

interface ActionHubProps {
  data: SubscriptionDefusalResponse;
}

export function ActionHub({ data }: ActionHubProps) {
  const { merchant, killSwitch } = data;
  const [portalOpened, setPortalOpened] = useState(false);
  const [icsDownloaded, setIcsDownloaded] = useState(false);

  const handleOpenPortal = () => {
    setPortalOpened(true);
    window.open(merchant.directPortalUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownloadIcs = () => {
    downloadKillSwitchIcs(killSwitch, `${merchant.name.toLowerCase().replace(/\s+/g, "-")}-kill-switch.ics`);
    setIcsDownloaded(true);
    setTimeout(() => setIcsDownloaded(false), 3000);
  };

  return (
    <div className="space-y-6 w-full text-left">
      {/* 1. Direct Portal Bypass Card */}
      <div className="glass-card p-6 border-blue-200/60 relative overflow-hidden">
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#11338a] flex items-center justify-center">
            <ExternalLink className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0f1e3b] font-display">
              Direct Portal Bypass
            </h3>
            <p className="text-xs text-[#54657a]">
              Skip settings menus &middot; Verified cancellation deep link
            </p>
          </div>
        </div>

        <p className="text-xs text-[#54657a] my-3 leading-relaxed">
          Opens the deep-linked plan management page for <strong>{merchant.name}</strong> directly in a new tab.
        </p>

        <button
          type="button"
          onClick={handleOpenPortal}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            portalOpened
              ? "bg-[#54b66e] text-white shadow-md"
              : "btn-primary"
          }`}
        >
          {portalOpened ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Portal Opened — Complete steps on left</span>
            </>
          ) : (
            <>
              <span>Open Cancellation Portal</span>
              <ExternalLink className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="mt-3 text-center">
          <span className="text-[11px] text-[#54657a] truncate block">
            Target: {merchant.directPortalUrl}
          </span>
        </div>
      </div>

      {/* 2. 1-Click Calendar Kill-Switch Card */}
      <div className="glass-card p-6 border-indigo-200/60">
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-[#11338a] flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0f1e3b] font-display">
              1-Click Calendar Kill-Switch
            </h3>
            <p className="text-xs text-[#54657a]">
              RFC 5545 reminder scheduled before renewal cutoff
            </p>
          </div>
        </div>

        <div className="my-3 p-3.5 rounded-xl bg-white/70 border border-[#d0e1ed] text-xs space-y-1.5 text-[#0f1e3b]">
          <div className="font-semibold text-[#11338a]">
            {killSwitch.eventTitle}
          </div>
          <div className="text-[#54657a]">
            Alert scheduled:{" "}
            <strong>
              {new Date(killSwitch.suggestedAlertDate).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </strong>{" "}
            (2 hours before renewal)
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadIcs}
          className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-[#d0e1ed] text-[#11338a] hover:border-[#11338a] font-semibold text-sm flex items-center justify-center space-x-2 transition-all shadow-sm cursor-pointer"
        >
          {icsDownloaded ? (
            <>
              <Check className="w-4 h-4 text-[#54b66e]" />
              <span className="text-[#54b66e]">Kill-Switch Downloaded (.ics)!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-[#11338a]" />
              <span>Download Kill-Switch (.ics)</span>
            </>
          )}
        </button>
      </div>

      {/* 3. Merchant Fine Print & Policy Notes */}
      {merchant.finePrintNotes && (
        <div className="glass-card p-5 border-slate-200">
          <div className="flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-[#11338a] mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-[#0f1e3b] uppercase tracking-wide">
                Merchant Policy Fine Print
              </h4>
              <p className="text-xs text-[#54657a] mt-1 leading-relaxed">
                {merchant.finePrintNotes}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
