"use client";

import React from "react";
import Image from "next/image";
import { Zap, Shield, Clock, Calendar } from "lucide-react";
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
    <main
      className="min-h-screen w-full flex flex-col justify-between px-6 sm:px-12 lg:px-20 py-8 lg:py-12 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/canceltrap-hero.png')",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Top / Main Split Area */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto w-full z-10 my-auto">
        {/* Left Section: Logo & Core Cards */}
        <div className="flex-1 max-w-xl text-left flex flex-col justify-center lg:pr-12 lg:border-r lg:border-[#d0e1ed]/50">
          {/* Real CancelTrap Transparent Logo */}
          <div className="mb-6">
            <Image
              src="/canceltrap-logo.png"
              alt="CancelTrap Logo"
              width={340}
              height={85}
              priority
              className="h-14 sm:h-16 w-auto object-contain drop-shadow-sm"
            />
          </div>

          {/* Clean, punchy headline - minimal text */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f1e3b] leading-[1.15] font-display">
            Defuse deceptive subscriptions.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#54657a] font-normal leading-relaxed">
            Expose hidden cancel mazes and disarm auto-renewals before you get charged.
          </p>

          {/* Feature Pill Cards on Left */}
          <div className="grid grid-cols-2 gap-3.5 mt-8 w-full">
            <div className="glass-card p-3.5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="w-7 h-7 rounded-lg bg-[#e0f1fe] flex items-center justify-center text-[#11338a] mb-2">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-[#0f1e3b] text-xs">Dark-Pattern Detection</h3>
              <p className="text-[11px] text-[#54657a] mt-0.5">Exposes hidden decoys</p>
            </div>

            <div className="glass-card p-3.5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="w-7 h-7 rounded-lg bg-[#e0f1fe] flex items-center justify-center text-[#11338a] mb-2">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-[#0f1e3b] text-xs">Direct Portal Bypass</h3>
              <p className="text-[11px] text-[#54657a] mt-0.5">Direct deep link</p>
            </div>

            <div className="glass-card p-3.5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="w-7 h-7 rounded-lg bg-[#e0f1fe] flex items-center justify-center text-[#11338a] mb-2">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-[#0f1e3b] text-xs">5-Year Vampire Bleed</h3>
              <p className="text-[11px] text-[#54657a] mt-0.5">Compounding cost</p>
            </div>

            <div className="glass-card p-3.5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="w-7 h-7 rounded-lg bg-[#e0f1fe] flex items-center justify-center text-[#11338a] mb-2">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-[#0f1e3b] text-xs">1-Click Kill-Switch</h3>
              <p className="text-[11px] text-[#54657a] mt-0.5">RFC 5545 .ics alert</p>
            </div>
          </div>
        </div>

        {/* Right Section: Clean Upload Card */}
        <div className="flex-1 flex justify-center lg:justify-end w-full lg:pl-6">
          <UploadCard
            onAnalyzeComplete={onAnalyzeComplete}
            isAnalyzing={isAnalyzing}
            setIsAnalyzing={setIsAnalyzing}
            error={error}
            setError={setError}
          />
        </div>
      </div>

      {/* Footer copyright note matching reference */}
      <div className="max-w-7xl mx-auto w-full z-10 pt-4 text-center">
        <span className="text-xs text-[#54657a]/80 py-1 px-3 rounded-full bg-white/50 backdrop-blur-sm border border-white/60">
          &copy; 2026 CancelTrap &middot; All rights reserved
        </span>
      </div>
    </main>
  );
}
