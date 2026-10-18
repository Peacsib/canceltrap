"use client";

import React from "react";
import Image from "next/image";
import { Shield, Zap, Clock, Calendar, CheckCircle } from "lucide-react";
import { UploadCard } from "./UploadCard";
import { SubscriptionDefusalResponse } from "@/lib/types";

interface HeroLandingProps {
  onAnalyzeComplete: (data: SubscriptionDefusalResponse) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export function HeroLanding({
  onAnalyzeComplete,
  isAnalyzing,
  setIsAnalyzing,
  error,
  setError,
}: HeroLandingProps) {
  return (
    <main className="min-h-screen w-full flex flex-col justify-between px-6 sm:px-12 lg:px-20 py-8 lg:py-12 relative overflow-hidden">
      {/* Ambient background glow accents matching Risklyte */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#afdeff]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-[32rem] h-[32rem] bg-[#d2ecff]/50 rounded-full blur-3xl pointer-events-none" />

      {/* Main split hero container */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto w-full z-10 my-auto">
        {/* Left Column: Branding, Headings & Value Props */}
        <div className="flex-1 max-w-2xl text-left">
          {/* Logo Brand Header */}
          <div className="flex items-center space-x-3 mb-8">
            {/* If user provides logo.png in public/, it can load; otherwise high-fidelity brand badge */}
            <div className="relative flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#11338a] flex items-center justify-center text-white shadow-md">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-extrabold tracking-tight text-[#0f1e3b] font-display">
                Cancel<span className="text-[#11338a]">Trap</span>
              </span>
              <span className="ml-2 px-2 py-0.5 rounded-full bg-[#e0f1fe] text-[#11338a] font-semibold text-xs tracking-wide uppercase border border-[#d0e1ed]">
                Defuser v1.0
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0f1e3b] leading-[1.15] font-display">
            Defuse deceptive subscriptions{" "}
            <span className="text-[#11338a] underline decoration-[#54b66e] decoration-4 underline-offset-8">
              before
            </span>{" "}
            they charge you.
          </h1>

          {/* Subhead */}
          <p className="mt-6 text-lg sm:text-xl text-[#54657a] font-normal leading-relaxed max-w-xl">
            Turn confusing free trial emails, Adobe mazes, and SaaS receipts into
            instant step-by-step defusal checklists, verified direct cancel links,
            and 1-click calendar kill-switches.
          </p>

          {/* Quick trust metrics */}
          <div className="mt-8 flex items-center space-x-6 text-sm text-[#0f1e3b] font-medium">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-[#54b66e]" />
              <span>Bypasses Decoy Mazes</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-[#54b66e]" />
              <span>Direct Cancellation Portal</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-[#54b66e]" />
              <span>Zero-Friction .ics Alerts</span>
            </div>
          </div>
        </div>

        {/* Right Column: Upload Card */}
        <div className="flex-1 flex justify-center lg:justify-end w-full">
          <UploadCard
            onAnalyzeComplete={onAnalyzeComplete}
            isAnalyzing={isAnalyzing}
            setIsAnalyzing={setIsAnalyzing}
            error={error}
            setError={setError}
          />
        </div>
      </div>

      {/* Bottom Feature Cards (Risklyte 4-pill style) */}
      <div className="max-w-7xl mx-auto w-full z-10 pt-8 mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="w-8 h-8 rounded-lg bg-[#e0f1fe] flex items-center justify-center text-[#11338a] mb-2.5">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-[#0f1e3b] text-sm">Dark-Pattern Detection</h3>
          <p className="text-xs text-[#54657a] mt-0.5">Exposes hidden buttons &amp; fees</p>
        </div>

        <div className="glass-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="w-8 h-8 rounded-lg bg-[#e0f1fe] flex items-center justify-center text-[#11338a] mb-2.5">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-[#0f1e3b] text-sm">Direct Portal Bypass</h3>
          <p className="text-xs text-[#54657a] mt-0.5">Instant link to hidden cancel page</p>
        </div>

        <div className="glass-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="w-8 h-8 rounded-lg bg-[#e0f1fe] flex items-center justify-center text-[#11338a] mb-2.5">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-[#0f1e3b] text-sm">5-Year Vampire Bleed</h3>
          <p className="text-xs text-[#54657a] mt-0.5">Calculates compounding drain</p>
        </div>

        <div className="glass-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="w-8 h-8 rounded-lg bg-[#e0f1fe] flex items-center justify-center text-[#11338a] mb-2.5">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-[#0f1e3b] text-sm">1-Click Kill-Switch</h3>
          <p className="text-xs text-[#54657a] mt-0.5">Pre-set RFC 5545 calendar alert</p>
        </div>
      </div>
    </main>
  );
}
