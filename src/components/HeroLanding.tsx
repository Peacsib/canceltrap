"use client";

import React from "react";
import Image from "next/image";
import { LayoutGrid, Shield, Zap, Calendar } from "lucide-react";
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
        {/* Left Column: Logo placed where the bold headline was + subhead */}
        <div className="flex-1 max-w-xl text-left flex flex-col justify-center">
          {/* Prominent Logo replacing the bold text headline */}
          <div className="mb-6">
            <Image
              src="/canceltrap-logo.png"
              alt="CancelTrap"
              width={420}
              height={105}
              priority
              className="h-16 sm:h-20 lg:h-24 w-auto object-contain drop-shadow-sm"
            />
          </div>

          {/* Clean Subhead */}
          <p className="text-lg sm:text-xl text-[#54657a] font-normal leading-relaxed max-w-lg">
            Turn sneaky renewal receipts into live defusal checklists — in seconds, with nothing to set up.
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

      {/* Bottom Left: 4 Frosted Feature Cards */}
      <div className="z-20 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl">
          {/* Card 1 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[20px] p-4 border border-white/90 shadow-[0_10px_25px_-10px_rgba(20,50,110,0.12)] text-left transition-transform hover:-translate-y-0.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#11338a] flex items-center justify-center mb-2.5">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#0f1e3b] text-xs">Automatic Defusal</h3>
            <p className="text-[11px] text-[#54657a] mt-0.5">No hidden mazes</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[20px] p-4 border border-white/90 shadow-[0_10px_25px_-10px_rgba(20,50,110,0.12)] text-left transition-transform hover:-translate-y-0.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#11338a] flex items-center justify-center mb-2.5">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#0f1e3b] text-xs">Direct by Design</h3>
            <p className="text-[11px] text-[#54657a] mt-0.5">Bypasses cancel traps</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[20px] p-4 border border-white/90 shadow-[0_10px_25px_-10px_rgba(20,50,110,0.12)] text-left transition-transform hover:-translate-y-0.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#11338a] flex items-center justify-center mb-2.5">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#0f1e3b] text-xs">Instant Insights</h3>
            <p className="text-[11px] text-[#54657a] mt-0.5">5-Year vampire bleed</p>
          </div>

          {/* Card 4 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[20px] p-4 border border-white/90 shadow-[0_10px_25px_-10px_rgba(20,50,110,0.12)] text-left transition-transform hover:-translate-y-0.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#11338a] flex items-center justify-center mb-2.5">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#0f1e3b] text-xs">Kill-Switch Ready</h3>
            <p className="text-[11px] text-[#54657a] mt-0.5">RFC 5545 in one click</p>
          </div>
        </div>
      </div>
    </main>
  );
}
