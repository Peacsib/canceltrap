"use client";

import React from "react";

import { PoppableWaterOrb } from "./PoppableWaterOrb";

export function CleanWaterMotionBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {/* 1. Base Pristine Hero Imagery with High-End Slow Ambient Breathing */}
      <div
        className="absolute inset-[-2%] w-[104%] h-[104%] bg-cover bg-no-repeat hero-ambient-breathe pointer-events-none"
        style={{
          backgroundImage: "url('/newhero.webp')",
          backgroundPosition: "left top",
          backgroundSize: "cover",
        }}
      />

      {/* 2. Soft Ambient Water-Blue Radiant Glows (Zero Green, Pure Sky & Azure) */}
      <div
        className="absolute top-[10%] right-[5%] w-150 h-150 rounded-full blur-[90px] opacity-40 water-caustics-gleam pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(14, 165, 233, 0.18) 45%, transparent 75%)",
        }}
      />
      <div
        className="absolute bottom-[-10%] right-[15%] w-175 h-125 rounded-full blur-[100px] opacity-50 water-caustics-gleam pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(186, 230, 253, 0.45) 0%, rgba(2, 132, 199, 0.15) 55%, transparent 80%)",
          animationDelay: "-4.5s",
        }}
      />

      {/* 3. Concentric Water Ripples under the 3D Glass Podium */}
      <div className="absolute bottom-[6%] right-[16%] w-105 h-40 pointer-events-none flex items-center justify-center -rotate-6">
        <div className="absolute inset-0 rounded-[100%] border border-sky-400/40 water-ripple-1 shadow-[0_0_24px_rgba(56,189,248,0.3)]" />
        <div className="absolute inset-0 rounded-[100%] border border-cyan-300/35 water-ripple-2 shadow-[0_0_28px_rgba(186,230,253,0.35)]" />
      </div>

      {/* 4. Sunlight / Glass Prismatic Sweep Beam */}
      <div
        className="absolute inset-[-50%] w-[200%] h-[200%] glass-beam-sweep pointer-events-none"
        style={{
          background:
            "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.45) 48%, rgba(186,230,253,0.35) 52%, transparent 65%)",
          mixBlendMode: "overlay",
        }}
      />

      {/* 5. Interactive Poppable Translucent Glass/Water Droplets & Specular Orbs */}
      {/* Orb 1: Upper-right luminous bubble */}
      <PoppableWaterOrb
        id="hero-orb-1"
        sizeClass="w-14 h-14"
        positionClass="top-[22%] right-[12%]"
        orbFloatClass="water-orb-1"
        gradient="radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95) 0%, rgba(224,242,254,0.45) 35%, rgba(56,189,248,0.12) 75%, transparent 100%)"
        highlightClass="top-2.5 left-2.5 w-3 h-2 rounded-full bg-white/90 rotate-[-25deg] blur-[0.4px]"
      />

      {/* Orb 2: Mid-right buoyant bubble */}
      <PoppableWaterOrb
        id="hero-orb-2"
        sizeClass="w-11 h-11"
        positionClass="top-[48%] right-[32%]"
        orbFloatClass="water-orb-2"
        gradient="radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9) 0%, rgba(186,230,253,0.4) 40%, rgba(14,165,233,0.1) 80%, transparent 100%)"
        highlightClass="top-2 left-2 w-2 h-1.5 rounded-full bg-white/85 rotate-[-20deg]"
      />

      {/* Orb 3: Lower ambient water bubble */}
      <PoppableWaterOrb
        id="hero-orb-3"
        sizeClass="w-8 h-8"
        positionClass="bottom-[24%] right-[22%]"
        orbFloatClass="water-orb-3"
        gradient="radial-gradient(circle at 30% 30%, rgba(255,255,255,0.92) 0%, rgba(224,242,254,0.5) 45%, transparent 90%)"
        highlightClass="top-1.5 left-1.5 w-1.5 h-1 rounded-full bg-white/95"
      />

      {/* Orb 4: Subtle delicate pearl bubble near top center */}
      <PoppableWaterOrb
        id="hero-orb-4"
        sizeClass="w-7 h-7"
        positionClass="top-[16%] left-[44%]"
        orbFloatClass="water-orb-1"
        gradient="radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85) 0%, rgba(186,230,253,0.3) 50%, transparent 100%)"
        highlightClass="top-1 left-1 w-1.5 h-1 rounded-full bg-white/90"
      />

      {/* Orb 5: Left buoyant water bubble */}
      <PoppableWaterOrb
        id="hero-orb-5"
        sizeClass="w-9 h-9"
        positionClass="top-[60%] left-[8%]"
        orbFloatClass="water-orb-2"
        gradient="radial-gradient(circle at 32% 28%, rgba(255,255,255,0.9) 0%, rgba(224,242,254,0.45) 40%, transparent 95%)"
        highlightClass="top-1.5 left-1.5 w-2 h-1 rounded-full bg-white/90"
      />

      {/* Orb 6: Near top-right ambient bubble */}
      <PoppableWaterOrb
        id="hero-orb-6"
        sizeClass="w-10 h-10"
        positionClass="top-[30%] right-[6%]"
        orbFloatClass="water-orb-2"
        gradient="radial-gradient(circle at 32% 28%, rgba(255,255,255,0.92) 0%, rgba(186,230,253,0.4) 40%, transparent 95%)"
        highlightClass="top-1.5 left-1.5 w-2 h-1 rounded-full bg-white/90"
      />

      {/* Orb 7: Lower-right podium ambient bubble */}
      <PoppableWaterOrb
        id="hero-orb-7"
        sizeClass="w-9 h-9"
        positionClass="bottom-[10%] right-[14%]"
        orbFloatClass="water-orb-3"
        gradient="radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(224,242,254,0.5) 45%, transparent 90%)"
        highlightClass="top-1 left-1 w-1.5 h-1 rounded-full bg-white/95"
      />

      {/* Orb 8: Upper-left ambient bubble */}
      <PoppableWaterOrb
        id="hero-orb-8"
        sizeClass="w-8 h-8"
        positionClass="top-[14%] left-[22%]"
        orbFloatClass="water-orb-1"
        gradient="radial-gradient(circle at 35% 30%, rgba(255,255,255,0.88) 0%, rgba(186,230,253,0.35) 45%, transparent 100%)"
        highlightClass="top-1 left-1 w-1.5 h-1 rounded-full bg-white/90"
      />

      {/* Orb 9: Bottom-left floating ambient bubble */}
      <PoppableWaterOrb
        id="hero-orb-9"
        sizeClass="w-8 h-8"
        positionClass="bottom-[16%] left-[22%]"
        orbFloatClass="water-orb-3"
        gradient="radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(224,242,254,0.45) 45%, transparent 90%)"
        highlightClass="top-1 left-1 w-1.5 h-1 rounded-full bg-white/95"
      />

      {/* 6. Pristine Crystalline Caustics Mesh Overlay on the Floor */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40%] water-caustics-gleam pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 75% 85%, rgba(56,189,248,0.18) 0%, transparent 60%),
                            radial-gradient(circle at 25% 90%, rgba(186,230,253,0.22) 0%, transparent 50%)`,
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
