"use client";

import React, { useState, useRef, useCallback } from "react";

// Web Audio API pure procedural water bubble "pop / bloop" synthesizer
function playBubblePopSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Natural water bubble pitch: starts at ~480Hz, ramps up quickly to ~920Hz, drops to ~320Hz
    osc.type = "sine";
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(940, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);

    // Envelope
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);

    setTimeout(() => {
      try {
        ctx.close();
      } catch {
        // ignore
      }
    }, 300);
  } catch {
    // Audio may be blocked by autoplay policies until user clicks
  }
}

// 8 radial splash angles for droplet particles
const SPLASH_DIRECTIONS = [
  { dx: 0, dy: -26 },
  { dx: 18, dy: -18 },
  { dx: 26, dy: 0 },
  { dx: 18, dy: 18 },
  { dx: 0, dy: 26 },
  { dx: -18, dy: 18 },
  { dx: -26, dy: 0 },
  { dx: -18, dy: -18 },
];

export interface PoppableWaterOrbProps {
  id: string;
  sizeClass?: string; // e.g. "w-14 h-14"
  positionClass?: string; // e.g. "top-[22%] right-[12%]"
  orbFloatClass?: string; // e.g. "water-orb-1"
  gradient?: string;
  hasHighlight?: boolean;
  highlightClass?: string;
  highlightStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  title?: string;
}

export function PoppableWaterOrb({
  sizeClass = "w-12 h-12",
  positionClass = "top-[20%] right-[10%]",
  orbFloatClass = "water-orb-1",
  gradient = "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95) 0%, rgba(224,242,254,0.45) 35%, rgba(56,189,248,0.12) 75%, transparent 100%)",
  hasHighlight = true,
  highlightClass = "top-2.5 left-2.5 w-3 h-2 rounded-full bg-white/90 rotate-[-25deg] blur-[0.4px]",
  highlightStyle,
  style,
  title = "Click to pop! 🫧",
}: PoppableWaterOrbProps) {
  const [isPopping, setIsPopping] = useState(false);
  const [isPopped, setIsPopped] = useState(false);
  const [isRespawning, setIsRespawning] = useState(false);
  const [popLabel, setPopLabel] = useState<string | null>(null);
  const respawnTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePop = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      if (isPopping || isPopped) return;

      playBubblePopSound();
      setIsPopping(true);
      setPopLabel("+1 🫧");

      // Trigger pop burst animation, then hide
      setTimeout(() => {
        setIsPopping(false);
        setIsPopped(true);
        setPopLabel(null);

        // Schedule respawn after 2.4s so user can keep popping
        if (respawnTimerRef.current) clearTimeout(respawnTimerRef.current);
        respawnTimerRef.current = setTimeout(() => {
          setIsRespawning(true);
          setIsPopped(false);

          setTimeout(() => {
            setIsRespawning(false);
          }, 600);
        }, 2200);
      }, 280);
    },
    [isPopping, isPopped]
  );

  if (isPopped) {
    return null;
  }

  return (
    <div
      onClick={handlePop}
      title={title}
      className={`absolute ${positionClass} ${sizeClass} select-none pointer-events-auto cursor-pointer z-40 group before:absolute before:-inset-4 before:content-[''] before:rounded-full before:z-50 ${
        isPopping
          ? "bubble-pop-anim pointer-events-none"
          : isRespawning
          ? "bubble-respawn-anim"
          : orbFloatClass
      }`}
      style={{
        transition: "transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      {/* Actual Glass/Water Sphere Body */}
      <div
        className={`w-full h-full rounded-full border border-white/85 shadow-[0_8px_24px_rgba(14,165,233,0.22)] backdrop-blur-[2px] transition-transform duration-200 group-hover:scale-115 group-hover:shadow-[0_0_28px_rgba(56,189,248,0.65),inset_0_1px_3px_rgba(255,255,255,1)] group-active:scale-90`}
        style={{
          background: gradient,
          ...style,
        }}
      >
        {/* Specular Droplet Highlight */}
        {hasHighlight && (
          <div className={`absolute ${highlightClass}`} style={highlightStyle} />
        )}

        {/* Hover Hint Bubble Tooltip */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap bg-sky-950/80 backdrop-blur-sm text-sky-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-400/30 shadow-md">
          Pop! 🫧
        </div>
      </div>

      {/* Pop Explosion Particles & Expanding Shockwave */}
      {isPopping && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Expanding Shockwave Ring */}
          <div className="absolute w-full h-full rounded-full border-2 border-sky-300 animate-ping opacity-75" />

          {/* Outward Burst Water Droplets */}
          {SPLASH_DIRECTIONS.map((dir, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-sky-200/90 shadow-[0_0_6px_rgba(56,189,248,0.8)] transition-all duration-300"
              style={{
                transform: `translate(${dir.dx * 1.5}px, ${dir.dy * 1.5}px) scale(0)`,
                opacity: 0,
                transition: "transform 0.28s ease-out, opacity 0.28s ease-out",
              }}
            />
          ))}

          {/* Floating Pop Score Badge */}
          {popLabel && (
            <span className="absolute -top-6 text-xs font-black text-sky-500 animate-bounce drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]">
              {popLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
