"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Zap } from "lucide-react";

export interface StickAngerSearcherProps {
  query: string;
  isSearching: boolean;
  isFound: boolean;
  onAnimationComplete?: () => void;
}

export function StickAngerSearcher({
  query,
  isSearching,
  isFound,
  onAnimationComplete,
}: StickAngerSearcherProps) {
  const [quipIndex, setQuipIndex] = useState(0);

  const angryQuips = [
    "Where's the cancel button?! 😤",
    "Checking settings... not in the footer! 🔍",
    "Dodging the 'Please stay!' decoy popup... 🏃‍♂️",
    "Bypassing the 5-page retention quiz! ⚡",
    "Corner to corner... you can't hide! 💥",
  ];

  // Rotate punchy quips every 1.5s
  useEffect(() => {
    if (!isSearching || isFound) return;
    const interval = setInterval(() => {
      setQuipIndex((prev) => (prev + 1) % angryQuips.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isSearching, isFound, angryQuips.length]);

  // When found, celebrate cleanly for 1.8s then complete
  useEffect(() => {
    if (isFound && onAnimationComplete) {
      const timer = setTimeout(() => {
        onAnimationComplete();
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [isFound, onAnimationComplete]);

  // Minimal, elegant celebratory confetti particles
  const confettiPieces = [
    { left: "12%", delay: "0s", color: "#10b981", size: 8 },
    { left: "24%", delay: "0.15s", color: "#f59e0b", size: 9 },
    { left: "36%", delay: "0.05s", color: "#06b6d4", size: 7 },
    { left: "50%", delay: "0.25s", color: "#8b5cf6", size: 10 },
    { left: "64%", delay: "0.1s", color: "#ec4899", size: 8 },
    { left: "76%", delay: "0.2s", color: "#10b981", size: 9 },
    { left: "88%", delay: "0.08s", color: "#3b82f6", size: 7 },
  ];

  return (
    <div
      className={`w-full rounded-2xl border transition-all duration-500 p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(31,85,150,0.08)] overflow-hidden relative select-none ${isFound
          ? "bg-linear-to-b from-emerald-50/70 via-white to-teal-50/30 border-emerald-300"
          : "bg-white border-slate-200/90"
        }`}
    >
      {/* ── Minimal celebratory confetti when found ── */}
      {isFound && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {confettiPieces.map((p, idx) => (
            <div
              key={idx}
              className="absolute top-0 animate-confetti-drop"
              style={{
                left: p.left,
                animationDelay: p.delay,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: "2px",
              }}
            />
          ))}
        </div>
      )}

      {/* ── Clean Top Header (1 Uncluttered Line) ── */}
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2 relative z-10">
        <div className="flex items-center gap-2">
          {isFound ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Route Defused & Unmasked!</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Hunting Cancellation Route</span>
            </span>
          )}
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Target: &ldquo;<span className="text-slate-700 font-semibold">{query}</span>&rdquo;
        </div>
      </div>

      {/* ── Main Stage: Clean Baseline & Cartoon Stick Figure ── */}
      <div className="relative h-44 w-full flex items-center justify-center overflow-hidden">
        {/* Subtle, clean ground track line */}
        <div className="absolute left-6 right-6 bottom-7 border-b border-slate-200/90" />

        {/* Runner Track Container */}
        <div
          className={`w-full h-full relative ${isFound ? "flex items-center justify-center" : ""
            }`}
        >
          <div
            className={`${isFound
                ? "transform scale-115 transition-transform duration-500 animate-victory-bounce"
                : "running-track absolute bottom-3"
              }`}
          >
            {/* ── Clean Speech Bubble (Always Upright) ── */}
            <div className="bubble-anchor">
              <div
                className={`text-xs font-bold px-3 py-1 rounded-xl shadow-xs border whitespace-nowrap transition-all ${isFound
                    ? "bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/10"
                    : "bg-white text-slate-800 border-slate-200 shadow-slate-200/50 animate-wobble-bubble"
                  }`}
              >
                {isFound ? "Aha! Found it! 🎉" : angryQuips[quipIndex]}
                {/* Tail */}
                <div
                  className={`bubble-tail ${isFound ? "border-t-emerald-600" : "border-t-white"
                    }`}
                />
              </div>
            </div>

            {/* ── Direction Flipping SVG Wrapper ── */}
            <div className={!isFound ? "flipper-wrapper" : ""}>
              <svg
                width="110"
                height="115"
                viewBox="0 0 110 115"
                className={`transition-colors duration-500 ${isFound
                    ? "stroke-emerald-600 fill-emerald-600"
                    : "stroke-slate-900 fill-slate-900"
                  }`}
                style={{ strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" }}
              >
                {/* ── Victory Sunburst Rays Around Head (When Found) ── */}
                {isFound && (
                  <g className="stroke-amber-400 fill-none" strokeWidth="2">
                    <line x1="55" y1="4" x2="55" y2="10" />
                    <line x1="70" y1="8" x2="66" y2="13" />
                    <line x1="80" y1="18" x2="74" y2="22" />
                    <line x1="40" y1="8" x2="44" y2="13" />
                    <line x1="30" y1="18" x2="36" y2="22" />
                  </g>
                )}

                {/* ── Billowing Ear Steam Plumes (When Searching) ── */}
                {!isFound && (
                  <g className="smoke-system">
                    {/* Left ear steam plume */}
                    <path
                      d="M 37 32 Q 26 23 18 27 Q 10 20 4 27 Q -1 33 6 38 T 37 34"
                      fill="#f8fafc"
                      stroke="#94a3b8"
                      strokeWidth="1.8"
                      className="ear-smoke-left"
                    />
                    {/* Right ear steam plume */}
                    <path
                      d="M 73 32 Q 84 23 92 27 Q 100 20 106 27 Q 111 33 104 38 T 73 34"
                      fill="#f8fafc"
                      stroke="#94a3b8"
                      strokeWidth="1.8"
                      className="ear-smoke-right"
                    />
                  </g>
                )}

                {/* ── Head (Circle cx=55 cy=32 r=18) ── */}
                <circle
                  cx="55"
                  cy="32"
                  r="18"
                  fill="none"
                  className={isFound ? "stroke-emerald-600" : "stroke-slate-900"}
                />

                {/* ── Signature Spiky Cowlick Hair ── */}
                <path d="M 50 14 L 47 7" fill="none" />
                <path d="M 55 14 L 55 6" fill="none" />
                <path d="M 60 14 L 63 7" fill="none" />

                {/* ── Facial Features ── */}
                {isFound ? (
                  /* Clean Joyful Smiling Face */
                  <g className="happy-face">
                    {/* Crescent happy eyes ^  ^ */}
                    <path d="M 45 28 Q 48 24 51 28" fill="none" strokeWidth="2.5" />
                    <path d="M 59 28 Q 62 24 65 28" fill="none" strokeWidth="2.5" />
                    {/* Open Smile */}
                    <path d="M 45 35 Q 55 45 65 35 Z" fill="#10b981" strokeWidth="2" />
                    {/* Cheeks */}
                    <circle cx="42" cy="35" r="2.5" fill="#6ee7b7" stroke="none" />
                    <circle cx="68" cy="35" r="2.5" fill="#6ee7b7" stroke="none" />
                  </g>
                ) : (
                  /* Authentic Hand-Drawn Angry Gritted Face */
                  <g className="angry-face">
                    {/* Fierce V-Eyebrows */}
                    <path d="M 44 23 L 52 27" fill="none" strokeWidth="2.8" />
                    <path d="M 66 23 L 58 27" fill="none" strokeWidth="2.8" />
                    {/* Pupils */}
                    <circle cx="48" cy="29" r="1.8" fill="currentColor" stroke="none" />
                    <circle cx="62" cy="29" r="1.8" fill="currentColor" stroke="none" />
                    {/* Clenched Gritted Teeth */}
                    <rect
                      x="45"
                      y="34"
                      width="20"
                      height="9"
                      rx="2"
                      fill="#ffffff"
                      strokeWidth="2"
                    />
                    <line x1="49" y1="34" x2="49" y2="43" strokeWidth="1.2" />
                    <line x1="53" y1="34" x2="53" y2="43" strokeWidth="1.2" />
                    <line x1="57" y1="34" x2="57" y2="43" strokeWidth="1.2" />
                    <line x1="61" y1="34" x2="61" y2="43" strokeWidth="1.2" />
                    <line x1="45" y1="38.5" x2="65" y2="38.5" strokeWidth="1.2" />
                  </g>
                )}

                {/* ── Torso ── */}
                <line x1="55" y1="50" x2="55" y2="78" strokeWidth="3" />

                {/* ── Limbs ── */}
                {isFound ? (
                  /* Victory Pose: Arms thrown high in triumph */
                  <g className="victory-limbs">
                    <line x1="55" y1="57" x2="36" y2="38" strokeWidth="3" />
                    <line x1="36" y1="38" x2="27" y2="20" strokeWidth="3" />
                    <circle cx="26" cy="18" r="3" fill="none" />

                    <line x1="55" y1="57" x2="74" y2="38" strokeWidth="3" />
                    <line x1="74" y1="38" x2="83" y2="20" strokeWidth="3" />
                    <circle cx="84" cy="18" r="3" fill="none" />

                    {/* Happy jumping legs */}
                    <line x1="55" y1="78" x2="40" y2="98" strokeWidth="3" />
                    <line x1="40" y1="98" x2="32" y2="98" strokeWidth="3" />

                    <line x1="55" y1="78" x2="70" y2="98" strokeWidth="3" />
                    <line x1="70" y1="98" x2="78" y2="98" strokeWidth="3" />
                  </g>
                ) : (
                  /* Running Stride Pose */
                  <g className="running-limbs">
                    {/* Left pumping arm */}
                    <line x1="55" y1="57" x2="38" y2="66" strokeWidth="3" className="arm-left" />
                    <circle cx="34" cy="70" r="2.5" fill="none" />

                    {/* Right pumping arm holding clean magnifying glass */}
                    <g className="arm-right">
                      <line x1="55" y1="57" x2="76" y2="52" strokeWidth="3" />
                      <circle cx="80" cy="48" r="2.5" fill="none" />
                      {/* Clean Magnifying Glass */}
                      <circle cx="87" cy="40" r="7" fill="none" strokeWidth="2" />
                      <line x1="82" y1="45" x2="78" y2="49" strokeWidth="2.5" />
                    </g>

                    {/* Scissor legs */}
                    <line x1="55" y1="78" x2="34" y2="98" strokeWidth="3" className="leg-left" />
                    <line x1="34" y1="98" x2="26" y2="98" strokeWidth="3" />

                    <line x1="55" y1="78" x2="78" y2="94" strokeWidth="3" className="leg-right" />
                    <line x1="78" y1="94" x2="86" y2="100" strokeWidth="3" />

                    {/* Single subtle dust puff */}
                    <circle cx="20" cy="97" r="3.5" fill="#cbd5e1" stroke="none" className="dust-puff" />
                  </g>
                )}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── Clean Bottom Status Bar (1 Subtle Line) ── */}
      <div className="mt-1 text-center">
        <p className="text-xs">
          {isFound ? (
            <span className="text-emerald-700 font-semibold flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-emerald-500 text-emerald-600" />
              Direct defusal route ready. Opening portal...
            </span>
          ) : (
            <span className="text-slate-400">
              Scanning live navigation paths &bull; Disarming hidden cancellation dark patterns
            </span>
          )}
        </p>
      </div>

      <style jsx>{`
        /* Smooth, Clean Corner-to-Corner Track Movement */
        @keyframes trackSlide {
          0% {
            left: 8%;
          }
          48% {
            left: 76%;
          }
          50% {
            left: 76%;
          }
          98% {
            left: 8%;
          }
          100% {
            left: 8%;
          }
        }

        .running-track {
          animation: trackSlide 3s ease-in-out infinite;
        }

        /* Direction Flipping for the SVG ONLY (Speech bubble never mirrors!) */
        @keyframes flipRunner {
          0%, 48% {
            transform: scaleX(1);
          }
          50%, 98% {
            transform: scaleX(-1);
          }
          100% {
            transform: scaleX(1);
          }
        }

        .flipper-wrapper {
          animation: flipRunner 3s ease-in-out infinite;
          transform-origin: center center;
        }

        /* Speech Bubble Positioning */
        .bubble-anchor {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          pointer-events: none;
        }

        .bubble-tail {
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top-width: 5px;
          border-top-style: solid;
        }

        @keyframes wobbleBubble {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }

        .animate-wobble-bubble {
          animation: wobbleBubble 0.8s ease-in-out infinite alternate;
        }

        /* Victory Bounce */
        @keyframes victoryBounce {
          0%, 100% {
            transform: translateY(0) scale(1.15);
          }
          50% {
            transform: translateY(-10px) scale(1.2);
          }
        }

        .animate-victory-bounce {
          animation: victoryBounce 0.45s ease-in-out infinite alternate;
        }

        /* Running Limbs Motion */
        @keyframes legLeft {
          0% {
            transform: rotate(-25deg);
            transform-origin: 55px 78px;
          }
          100% {
            transform: rotate(30deg);
            transform-origin: 55px 78px;
          }
        }

        @keyframes legRight {
          0% {
            transform: rotate(30deg);
            transform-origin: 55px 78px;
          }
          100% {
            transform: rotate(-25deg);
            transform-origin: 55px 78px;
          }
        }

        .leg-left {
          animation: legLeft 0.25s ease-in-out infinite alternate;
        }

        .leg-right {
          animation: legRight 0.25s ease-in-out infinite alternate;
        }

        @keyframes armLeft {
          0% {
            transform: rotate(20deg);
            transform-origin: 55px 57px;
          }
          100% {
            transform: rotate(-25deg);
            transform-origin: 55px 57px;
          }
        }

        @keyframes armRight {
          0% {
            transform: rotate(-15deg);
            transform-origin: 55px 57px;
          }
          100% {
            transform: rotate(15deg);
            transform-origin: 55px 57px;
          }
        }

        .arm-left {
          animation: armLeft 0.25s ease-in-out infinite alternate;
        }

        .arm-right {
          animation: armRight 0.25s ease-in-out infinite alternate;
        }

        /* Subtle Dust Puff */
        @keyframes dustPuff {
          0% {
            opacity: 0.7;
            transform: scale(0.7) translateX(0);
          }
          100% {
            opacity: 0;
            transform: scale(1.4) translateX(-8px);
          }
        }

        .dust-puff {
          animation: dustPuff 0.35s ease-out infinite;
        }

        /* Ear Smoke Plumes */
        @keyframes smokeLeft {
          0% {
            opacity: 0.5;
            transform: translateX(0) scale(0.9);
          }
          50% {
            opacity: 0.95;
            transform: translateX(-5px) scale(1.15);
          }
          100% {
            opacity: 0.5;
            transform: translateX(-10px) scale(1);
          }
        }

        @keyframes smokeRight {
          0% {
            opacity: 0.5;
            transform: translateX(0) scale(0.9);
          }
          50% {
            opacity: 0.95;
            transform: translateX(5px) scale(1.15);
          }
          100% {
            opacity: 0.5;
            transform: translateX(10px) scale(1);
          }
        }

        .ear-smoke-left {
          animation: smokeLeft 0.5s ease-in-out infinite;
        }

        .ear-smoke-right {
          animation: smokeRight 0.5s ease-in-out infinite;
        }

        /* Elegant Confetti Drop */
        @keyframes confettiDrop {
          0% {
            transform: translateY(-8px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(180px) rotate(260deg);
            opacity: 0;
          }
        }

        .animate-confetti-drop {
          animation: confettiDrop 1.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
