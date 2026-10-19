"use client";

import React from "react";
import Image from "next/image";
import { Search, Shield, TrendingDown, Calendar } from "lucide-react";
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
      className="h-screen w-full flex flex-col justify-between px-8 sm:px-14 lg:px-20 py-8 lg:py-12 relative overflow-hidden bg-cover bg-center bg-no-repeat select-none"
      style={{
        backgroundImage: "url('/canceltrap-hero.png')",
      }}
    >
      {/* Main Middle Row: Left Brand/Content & Right Upload Card */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto w-full z-10 my-auto">
        {/* Left Column: Big Logo + Meaningful Tagline */}
        <div className="flex-1 max-w-xl text-left flex flex-col justify-center">
          {/* Big, Commanding Brand Logo */}
          <div className="mb-4 -ml-1">
            <Image
              src="/canceltrap-logo.png"
              alt="CancelTrap"
              width={600}
              height={150}
              priority
              className="h-20 sm:h-24 lg:h-28 w-auto object-contain drop-shadow-sm"
            />
          </div>

          {/* Meaningful, Human Tagline (No Jargon) */}
          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#0f1e3b] font-display tracking-tight leading-snug">
            Cancel hidden subscriptions before you get charged.
          </h1>

          <p className="mt-3 text-base sm:text-lg text-[#54657a] font-normal leading-relaxed max-w-lg">
            Drop any receipt or trial email to find the direct cancellation link and set a reminder before money leaves your account.
          </p>
        </div>

        {/* Right Column: Floating Upload Card */}
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

      {/* Bottom Left: 4 Frosted Feature Cards (Human-First Copy) */}
      <div className="z-20 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl">
          {/* Card 1 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[20px] p-4 border border-white/90 shadow-[0_10px_25px_-10px_rgba(20,50,110,0.12)] text-left transition-transform hover:-translate-y-0.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#11338a] flex items-center justify-center mb-2.5">
              <Search className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#0f1e3b] text-xs">Expose Hidden Traps</h3>
            <p className="text-[11px] text-[#54657a] mt-0.5">Spot decoy pause buttons</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[20px] p-4 border border-white/90 shadow-[0_10px_25px_-10px_rgba(20,50,110,0.12)] text-left transition-transform hover:-translate-y-0.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#11338a] flex items-center justify-center mb-2.5">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#0f1e3b] text-xs">Direct Cancel Link</h3>
            <p className="text-[11px] text-[#54657a] mt-0.5">Skip tricky settings menus</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[20px] p-4 border border-white/90 shadow-[0_10px_25px_-10px_rgba(20,50,110,0.12)] text-left transition-transform hover:-translate-y-0.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#11338a] flex items-center justify-center mb-2.5">
              <TrendingDown className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#0f1e3b] text-xs">Cost Projection</h3>
            <p className="text-[11px] text-[#54657a] mt-0.5">5-Year cumulative drain</p>
          </div>

          {/* Card 4 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[20px] p-4 border border-white/90 shadow-[0_10px_25px_-10px_rgba(20,50,110,0.12)] text-left transition-transform hover:-translate-y-0.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#11338a] flex items-center justify-center mb-2.5">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#0f1e3b] text-xs">Calendar Kill-Switch</h3>
            <p className="text-[11px] text-[#54657a] mt-0.5">Reminder before you pay</p>
          </div>
        </div>
      </div>
    </main>
  );
}
