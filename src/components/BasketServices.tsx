"use client";

import React, { useState } from "react";
import { AwsSvg } from "./AwsLogo";
import { BlueStickFighter } from "./BlueStickFighter";

interface ServiceLogo {
  id: string;
  name: string;
  plan: string;
  dx: number; // px offset from center X
  dy: number; // px offset from center Y
  size: number;
  delay: string;
  floatClass: string;
  icon: React.ReactNode;
}

interface BasketServicesProps {
  onSelectService: (serviceId: string) => void;
}

export function BasketServices({ onSelectService }: BasketServicesProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [poppingId, setPoppingId] = useState<string | null>(null);
  const [whackedId, setWhackedId] = useState<string | null>(null);
  const [whackBadge, setWhackBadge] = useState<{ id: string; text: string } | null>(null);

  // Play satisfying clean soft pop/whack sound effect via Web Audio
  const playWhackSound = (freq = 420) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.24, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  };

  // Called whenever the stick fighter lands an attack on a logo
  const handleStrikeLogo = (serviceId: string, effectText: string) => {
    setWhackedId(serviceId);
    setWhackBadge({ id: serviceId, text: effectText });
    // Muted automatic hit sound per user request (silent visual impact)

    setTimeout(() => {
      setWhackedId((current) => (current === serviceId ? null : current));
    }, 550);

    setTimeout(() => {
      setWhackBadge((current) => (current?.id === serviceId ? null : current));
    }, 850);
  };

  const handleBubbleClick = (s: ServiceLogo) => {
    if (poppingId) return; // Prevent double clicks during pop
    setPoppingId(s.id);
    playWhackSound(640);

    setTimeout(() => {
      onSelectService(s.id);
    }, 420);
  };

  // 10 Real Official Subscription Trap Logos
  // Perfectly calibrated orbit around the central Stick Fighter matching user reference image
  const services: ServiceLogo[] = [
    // 1. AWS - Top-Left
    {
      id: "aws",
      name: "AWS",
      plan: "Cloud & Marketplace",
      dx: -118,
      dy: -52,
      size: 46,
      delay: "0s",
      floatClass: "basket-float-a",
      icon: <AwsSvg className="w-6 h-6" />,
    },

    // 2. Lovable - Upper Left-Center (Elevated above stick head with clear margin)
    {
      id: "lovable",
      name: "Lovable",
      plan: "Pro $20/mo",
      dx: -72,
      dy: -94,
      size: 46,
      delay: "0.8s",
      floatClass: "basket-float-c",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 44 44" fill="none">
          <rect width="44" height="44" rx="11" fill="#F4F1EA" />
          <path
            d="M13 28V16C13 11 16.8 7 21.5 7C26.2 7 30 11 30 16V18.5C30 18.8 30.2 19 30.5 19C33.5 19 36 21.5 36 24.5C36 27.5 33.5 30 30.5 30H17C14.8 30 13 28.2 13 26Z"
            fill="url(#lovableUserGradient)"
          />
          <defs>
            <linearGradient id="lovableUserGradient" x1="18" y1="7" x2="26" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF601C" />
              <stop offset="48%" stopColor="#FF2B75" />
              <stop offset="100%" stopColor="#6C5CE7" />
            </linearGradient>
          </defs>
        </svg>
      ),
    },

    // 3. ChatGPT - Top Right-Center (Elevated with clear margin)
    {
      id: "chatgpt",
      name: "ChatGPT",
      plan: "Plus $20/mo",
      dx: 48,
      dy: -90,
      size: 48,
      delay: "0.4s",
      floatClass: "basket-float-b",
      icon: (
        <svg
          className="w-6 h-6 text-black"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <path
              key={angle}
              d="M50 36.5 L65 27.8 C72 23.8 81 26.2 85 33.2 C89 40.2 86.6 49.2 79.6 53.2 L64.6 61.9 L50 53.5"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </svg>
      ),
    },

    // 4. Gemini - Top-Right Outer (4-Point Diamond Sparkle)
    {
      id: "gemini",
      name: "Gemini",
      plan: "Advanced $19.99/mo",
      dx: 112,
      dy: -48,
      size: 48,
      delay: "1.2s",
      floatClass: "basket-float-a",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
            fill="url(#geminiUserGrad)"
          />
          <defs>
            <linearGradient id="geminiUserGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1B73E8" />
              <stop offset="35%" stopColor="#8AB4F8" />
              <stop offset="65%" stopColor="#C58AF9" />
              <stop offset="100%" stopColor="#FA7B17" />
            </linearGradient>
          </defs>
        </svg>
      ),
    },

    // 5. Adobe - Mid-Left (Red square with white "A")
    {
      id: "adobe",
      name: "Adobe",
      plan: "Creative Cloud",
      dx: -130,
      dy: 10,
      size: 46,
      delay: "1.5s",
      floatClass: "basket-float-b",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill="#EB1000" />
          <path d="M15.1 4H20v16L15.1 4zM8.9 4H4v16L8.9 4zM12 10.5L15.6 20h-2.9l-1.1-2.9H9.4l2-5.6.6-1z" fill="#FFFFFF" />
        </svg>
      ),
    },

    // 6. Figma - Mid-Right (5-blob emblem)
    {
      id: "figma",
      name: "Figma",
      plan: "Pro Seats",
      dx: 134,
      dy: 12,
      size: 46,
      delay: "0.3s",
      floatClass: "basket-float-c",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M8 24C10.2091 24 12 22.2091 12 20V16H8C5.79086 16 4 17.7909 4 20C4 22.2091 5.79086 24 8 24Z" fill="#0ACF83" />
          <path d="M4 12C4 9.79086 5.8 8 8 8H12V16H8C5.8 16 4 14.2091 4 12Z" fill="#A259FF" />
          <path d="M4 4C4 1.79086 5.79086 0 8 0H12V8H8C5.8 8 4 6.20914 4 4Z" fill="#F24E1E" />
          <path d="M12 0H16C18.2091 0 20 1.79086 20 4C20 6.20914 18.2091 8 16 8H12V0Z" fill="#FF7262" />
          <circle cx="16" cy="12" r="4" fill="#1ABCFE" />
        </svg>
      ),
    },

    // 7. Netflix - Lower-Mid Right (Red N ribbon)
    {
      id: "netflix",
      name: "Netflix",
      plan: "Premium 4K",
      dx: 98,
      dy: 58,
      size: 46,
      delay: "0.7s",
      floatClass: "basket-float-a",
      icon: (
        <svg className="w-5 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M4 2v20l4.5-2V2H4zm11.5 0l-5 18h4.5l5-18h-4.5zM15.5 2h4.5v20l-4.5-2V2z" fill="#E50914" />
        </svg>
      ),
    },

    // 8. Notion - Bottom-Left ('N' Monogram)
    {
      id: "notion",
      name: "Notion",
      plan: "Plus $10/mo",
      dx: -108,
      dy: 74,
      size: 45,
      delay: "1.4s",
      floatClass: "basket-float-a",
      icon: (
        <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="none">
          <path
            d="M4.459 4.208c.746.606 1.026.56 2.428.466l10.89-.746c1.12-.093 1.399.28 1.12 1.213l-1.866 6.344c-.28.933-.84 1.213-1.866 1.306l-9.883.653c-.933.093-1.306-.373-1.026-1.306l1.866-6.43c.28-.933.187-1.213-.663-1.5z"
            fill="#000000"
            opacity="0.15"
          />
          <path
            d="M2.5 4.5l1.5 15.5 15.5-1 1.5-15.5L2.5 4.5zm5.5 3h2.5l4 7.5V7.5h2v9h-2.5l-4-7.5v7.5h-2v-9z"
            fill="#000000"
          />
        </svg>
      ),
    },

    // 9. Spotify - Bottom-Center Right (Green disc)
    {
      id: "spotify",
      name: "Spotify",
      plan: "Family Plan",
      dx: 42,
      dy: 88,
      size: 48,
      delay: "1.1s",
      floatClass: "basket-float-b",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#1ED760" />
          <path
            d="M17.5 17.2c-.2.3-.6.4-.9.2-2.5-1.5-5.6-1.8-9.3-1-.4.1-.7-.2-.8-.5-.1-.4.2-.7.5-.8 4.1-.9 7.5-.6 10.3 1.1.3.2.4.6.2 1zm1.2-2.7c-.3.4-.8.5-1.2.3-2.9-1.8-7.3-2.3-107-1.3-.4.1-.9-.1-1-.6-.1-.4.1-.9.6-1 3.9-1.2 8.7-.6 12 1.4.4.2.5.8.3 1.2zm.1-2.9c-3.5-2.1-9.2-2.3-12.6-1.2-.5.2-1.1-.1-1.3-.6-.2-.5.1-1.1.6-1.3 3.9-1.2 10.2-1 14.2 1.4.5.3.6.9.3 1.4-.3.5-.9.6-1.2.3z"
            fill="#000000"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-88 h-80 sm:w-100 sm:h-85 relative pointer-events-auto select-none flex items-center justify-center">
      {/* ── Soft Ambient Glow inside the Chair Basin ── */}
      <div
        className="absolute inset-[10%] rounded-full blur-2xl pointer-events-none opacity-45"
        style={{
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.45) 0%, rgba(14, 165, 233, 0.18) 50%, transparent 75%)",
        }}
      />

      {/* ── Center Arena: Intelligent Roaming Blue Stick Anger Fighter ── */}
      {/* Freely navigates, walks, runs, dodges, spins, and whacks logos one by one */}
      <BlueStickFighter
        isAttacking={Boolean(poppingId)}
        targetService={hoveredId || poppingId}
        onStrikeLogo={handleStrikeLogo}
      />

      {/* ── The 10 Floating Logo Marbles (Orbiting smoothly around the stick fighter) ── */}
      {services.map((s) => {
        const isHovered = hoveredId === s.id;
        const isPopping = poppingId === s.id;
        const isWhacked = whackedId === s.id;

        return (
          <div
            key={s.id}
            style={{
              top: `calc(50% + ${s.dy}px)`,
              left: `calc(50% + ${s.dx}px)`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              transform: "translate(-50%, -50%)",
              animationDelay: s.delay,
            }}
            className={`absolute z-20 ${s.floatClass}`}
            onMouseEnter={() => setHoveredId(s.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Burst shockwave ring when popped or whacked */}
            {(isPopping || isWhacked) && (
              <div className="absolute inset-0 rounded-full border-2 border-sky-400 bg-sky-300/30 bubble-burst-ring pointer-events-none" />
            )}

            {/* Floating Comic Damage / Defusal Tag when struck */}
            {whackBadge?.id === s.id && (
              <div className="absolute -top-7 left-1/2 comic-hit-tag whitespace-nowrap z-40">
                <span className="px-2 py-0.5 rounded-full bg-linear-to-r from-[#1658eb] to-[#0284c7] text-white text-[10px] font-black shadow-[0_4px_12px_rgba(22,88,235,0.4)] border border-white/60">
                  {whackBadge.text}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => handleBubbleClick(s)}
              className={`w-full h-full rounded-full bg-white/94 hover:bg-white backdrop-blur-xl border border-white/95 shadow-[0_8px_18px_rgba(15,30,59,0.12),0_1px_3px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,0.95)] hover:shadow-[0_12px_28px_rgba(22,88,235,0.38),0_0_18px_rgba(56,189,248,0.3)] hover:border-[#1658eb]/50 hover:scale-120 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer group relative ${
                isPopping ? "bubble-pop-anim" : isWhacked ? "logo-recoil-hit" : ""
              }`}
              title={`${s.name} - ${s.plan} (Click to defuse)`}
            >
              {/* Glossy Top Specular Highlight on the Marble */}
              <div className="absolute top-1 left-2 w-2.5 h-1.5 rounded-full bg-white/90 rotate-[-25deg] blur-[0.3px] pointer-events-none" />

              {/* Centered Authentic Brand Logo */}
              <div className="transition-transform group-hover:scale-110 flex items-center justify-center pointer-events-none">
                {s.icon}
              </div>

              {/* Minimalist Floating Tooltip on Hover */}
              {isHovered && !isPopping && !isWhacked && (
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-full bg-[#0c1b38]/90 backdrop-blur-md text-white text-[10px] font-bold shadow-lg pointer-events-none z-30 animate-in fade-in zoom-in-95 duration-150 flex items-center gap-1">
                  <span>{s.name}</span>
                  <span className="text-sky-300 font-normal">({s.plan})</span>
                </div>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
