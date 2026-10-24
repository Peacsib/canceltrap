"use client";

import React, { useState, useEffect, useRef } from "react";

export type FighterAction =
  | "run"
  | "bat_swing"
  | "flying_kick"
  | "boxing_combo"
  | "jump_slam"
  | "dodge"
  | "spin"
  | "victory_dance";

interface BlueStickFighterProps {
  isAttacking?: boolean;
  targetService?: string | null;
  onStrikeLogo?: (serviceId: string, effectText: string) => void;
}

interface TargetSpot {
  id: string;
  x: number;
  y: number;
  action: FighterAction;
  text: string;
}

export function BlueStickFighter({ isAttacking = false, targetService, onStrikeLogo }: BlueStickFighterProps) {
  // Arena position state (freely navigates inside the glass dome arena)
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 5 });
  const [currentAction, setCurrentAction] = useState<FighterAction>("bat_swing");
  const [actionPhase, setActionPhase] = useState<"idle" | "running" | "windup" | "impact" | "recover">("idle");
  const [facingDirection, setFacingDirection] = useState<"right" | "left">("right");
  const [runFrame, setRunFrame] = useState(0);
  const [danceStep, setDanceStep] = useState(0);
  const [spinDeg, setSpinDeg] = useState(0);
  const [punchHand, setPunchHand] = useState<"left" | "right">("right");

  const sequenceIndexRef = useRef(0);
  const isBusyRef = useRef(false);
  const positionRef = useRef<{ x: number; y: number }>({ x: 0, y: 5 });

  // Targets corresponding to the 9 active logos (cloud logo removed)
  const logoTargets: Record<string, { x: number; y: number; action: FighterAction; text: string }> = {
    aws: { x: -62, y: -22, action: "bat_swing", text: "-$65/mo Cancelled! 💥" },
    chatgpt: { x: 18, y: -45, action: "bat_swing", text: "Plus Trap Busted! ⚡" },
    adobe: { x: -74, y: 8, action: "flying_kick", text: "Termination Fee Waived! 🥊" },
    figma: { x: 74, y: 10, action: "boxing_combo", text: "Seats Reduced! 🛡️" },
    spotify: { x: 16, y: 44, action: "jump_slam", text: "Free Tier Restored! 🎵" },
    notion: { x: -58, y: 38, action: "bat_swing", text: "Subscription Cut! ⚔️" },
    lovable: { x: -34, y: -48, action: "flying_kick", text: "Downgraded to Free! ✨" },
    netflix: { x: 54, y: 34, action: "bat_swing", text: "Auto-Renew Killed! 🛑" },
    gemini: { x: 64, y: -18, action: "boxing_combo", text: "AI Trap Defused! ⚡" },
  };

  // Autonomous, intelligent sequence: hunts logos one by one, dodges, spins, and celebrates!
  const autonomousRoutine: TargetSpot[] = [
    { id: "aws", x: -62, y: -22, action: "bat_swing", text: "-$65/mo Cancelled! 💥" },
    { id: "dodge", x: -20, y: -5, action: "dodge", text: "" },
    { id: "chatgpt", x: 18, y: -45, action: "bat_swing", text: "Plus Trap Busted! ⚡" },
    { id: "spin", x: 0, y: -10, action: "spin", text: "" },
    { id: "adobe", x: -74, y: 8, action: "flying_kick", text: "Termination Fee Waived! 🥊" },
    { id: "figma", x: 74, y: 10, action: "boxing_combo", text: "Seats Reduced! 🛡️" },
    { id: "dodge", x: 40, y: 10, action: "dodge", text: "" },
    { id: "spotify", x: 16, y: 44, action: "jump_slam", text: "Free Tier Restored! 🎵" },
    { id: "notion", x: -58, y: 38, action: "bat_swing", text: "Subscription Cut! ⚔️" },
    { id: "lovable", x: -34, y: -48, action: "flying_kick", text: "Downgraded to Free! ✨" },
    { id: "netflix", x: 54, y: 34, action: "bat_swing", text: "Auto-Renew Killed! 🛑" },
    { id: "gemini", x: 64, y: -18, action: "boxing_combo", text: "AI Trap Defused! ⚡" },
    { id: "victory", x: 0, y: 5, action: "victory_dance", text: "Defused All Traps! 🏆" },
  ];

  // Execute a targeted movement & action routine
  const executeTargetMove = (spot: TargetSpot) => {
    isBusyRef.current = true;

    // 1. Determine direction from positionRef
    const newFacing = spot.x < positionRef.current.x ? "left" : "right";
    setFacingDirection(newFacing);

    // 2. RUN / WALK to position
    setCurrentAction("run");
    setActionPhase("running");
    positionRef.current = { x: spot.x, y: spot.y };
    setPosition({ x: spot.x, y: spot.y });

    // Leg cycle animation during run
    const runTimer = setInterval(() => {
      setRunFrame((f) => (f + 1) % 4);
    }, 65);

    // 3. Arrive at destination after transit (360ms)
    setTimeout(() => {
      clearInterval(runTimer);

      if (spot.action === "dodge") {
        setCurrentAction("dodge");
        setActionPhase("impact");
        // Nimble back-hop
        const dodgeX = spot.x + (newFacing === "left" ? 22 : -22);
        const dodgeY = spot.y + 4;
        positionRef.current = { x: dodgeX, y: dodgeY };
        setPosition({ x: dodgeX, y: dodgeY });
        setTimeout(() => {
          setActionPhase("idle");
          isBusyRef.current = false;
        }, 360);
        return;
      }

      if (spot.action === "spin") {
        setCurrentAction("spin");
        setActionPhase("impact");
        setSpinDeg((d) => d + 360);
        setTimeout(() => {
          setActionPhase("idle");
          isBusyRef.current = false;
        }, 420);
        return;
      }

      if (spot.action === "victory_dance") {
        setCurrentAction("victory_dance");
        setActionPhase("impact");
        setTimeout(() => {
          setActionPhase("idle");
          isBusyRef.current = false;
        }, 900);
        return;
      }

      // Normal Martial Arts Strikes: Bat Swing, Flying Kick, Boxing Combo, Jump Slam
      setCurrentAction(spot.action);
      setActionPhase("windup");

      setTimeout(() => {
        setActionPhase("impact");

        if (spot.action === "boxing_combo") {
          setPunchHand("left");
          setTimeout(() => setPunchHand("right"), 100);
        }

        // Trigger logo reaction!
        if (onStrikeLogo && spot.id) {
          onStrikeLogo(spot.id, spot.text);
        }

        setTimeout(() => {
          setActionPhase("recover");
          setTimeout(() => {
            setActionPhase("idle");
            isBusyRef.current = false;
          }, 160);
        }, 220);
      }, 140);
    }, 360);
  };

  // Autonomous hunting loop: continuously traverses through targets one by one
  useEffect(() => {
    const loopInterval = setInterval(() => {
      if (isBusyRef.current) return;

      const nextSpot = autonomousRoutine[sequenceIndexRef.current];
      sequenceIndexRef.current = (sequenceIndexRef.current + 1) % autonomousRoutine.length;
      executeTargetMove(nextSpot);
    }, 2100);

    return () => clearInterval(loopInterval);
  }, []);

  // Interactive mouse reaction: when user hovers or clicks ANY logo, sprint straight to it and strike!
  useEffect(() => {
    if (targetService && logoTargets[targetService]) {
      const target = logoTargets[targetService];
      executeTargetMove({
        id: targetService,
        x: target.x,
        y: target.y,
        action: target.action,
        text: target.text,
      });
    }
  }, [targetService, isAttacking]);

  // Victory dance hip sway
  useEffect(() => {
    if (currentAction === "victory_dance") {
      const dInterval = setInterval(() => {
        setDanceStep((s) => (s + 1) % 4);
      }, 140);
      return () => clearInterval(dInterval);
    }
  }, [currentAction]);

  return (
    <div
      className="absolute top-1/2 left-1/2 select-none pointer-events-none will-change-transform z-20 flex items-center justify-center"
      style={{
        transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
        transition:
          actionPhase === "running"
            ? "transform 0.44s cubic-bezier(0.25, 1, 0.5, 1)"
            : currentAction === "dodge"
            ? "transform 0.28s cubic-bezier(0.1, 0.9, 0.2, 1)"
            : "transform 0.3s ease-out",
      }}
    >
      {/* ── Stick Fighter Flip & Sizing Wrapper ── */}
      <div
        className={`relative w-36 h-40 flex items-center justify-center transition-transform duration-200 ${
          facingDirection === "left" ? "scale-x-[-1]" : "scale-x-100"
        }`}
        style={{
          transform: currentAction === "spin" ? `rotate(${spinDeg}deg)` : undefined,
          transition: currentAction === "spin" ? "transform 0.48s cubic-bezier(0.4, 0, 0.2, 1)" : undefined,
        }}
      >
        {/* ── Dynamic Contact Shadow on Pedestal Surface ── */}
        <div
          className={`absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full blur-[2.5px] pointer-events-none transition-all duration-200 ${
            currentAction === "jump_slam" && actionPhase === "windup"
              ? "w-12 h-1.5 bg-sky-400/10 opacity-20"
              : actionPhase === "impact"
              ? "w-24 h-3.5 bg-sky-400/40 opacity-90 scale-120"
              : "w-20 h-3 bg-sky-400/25 opacity-70"
          }`}
        />

        {/* ── Combat Action Lines & Whack Impact Sparks ── */}
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-100 z-20 ${
            actionPhase === "impact" ? "opacity-100" : "opacity-0"
          }`}
          viewBox="0 0 140 150"
          fill="none"
        >
          {/* Bat Swing Curved Speed Lines & Radiating Impact Ticks */}
          {(currentAction === "bat_swing" || currentAction === "spin") && (
            <g>
              <path d="M 52 20 Q 110 24 135 76" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M 64 32 Q 118 36 130 88" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" />
              <g stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round">
                <line x1="120" y1="24" x2="136" y2="12" />
                <line x1="128" y1="34" x2="144" y2="30" />
                <line x1="126" y1="46" x2="140" y2="54" />
                <line x1="110" y1="16" x2="122" y2="4" />
              </g>
              {/* Comic Starburst */}
              <path
                d="M 120 32 L 125 24 L 129 30 L 136 28 L 132 35 L 138 40 L 131 42 L 129 49 L 124 42 L 117 44 L 120 36 L 115 32 Z"
                fill="#fef08a"
                stroke="#eab308"
                strokeWidth="1"
                className="animate-ping"
              />
            </g>
          )}

          {/* Flying Kick Speed Streak */}
          {currentAction === "flying_kick" && (
            <g stroke="#38bdf8" strokeWidth="2.4" strokeLinecap="round">
              <line x1="55" y1="82" x2="105" y2="82" strokeDasharray="6 3" />
              <line x1="70" y1="88" x2="120" y2="88" strokeDasharray="8 4" />
              <circle cx="122" cy="85" r="4.5" fill="#fef08a" stroke="#0284c7" strokeWidth="1.5" />
            </g>
          )}

          {/* Boxing Combo Sparks */}
          {currentAction === "boxing_combo" && (
            <g stroke="#0284c7" strokeWidth="2" strokeLinecap="round">
              <line x1="106" y1="56" x2="120" y2="52" />
              <line x1="108" y1="64" x2="122" y2="70" />
              <circle cx="114" cy="60" r="3.5" fill="#38bdf8" />
            </g>
          )}

          {/* Jump Slam Floor Ripple */}
          {currentAction === "jump_slam" && (
            <ellipse cx="70" cy="138" rx="34" ry="6" stroke="#38bdf8" strokeWidth="2" fill="none" className="animate-ping" />
          )}

          {/* Dodge Dust Cloud */}
          {currentAction === "dodge" && (
            <g stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" opacity="0.8">
              <path d="M 40 134 Q 48 128 56 134" />
              <path d="M 48 138 Q 56 132 64 138" />
            </g>
          )}
        </svg>

        {/* ── Main Stick Fighter SVG ── */}
        <svg
          viewBox="0 0 140 150"
          className={`w-full h-full filter drop-shadow-[0_5px_12px_rgba(22,88,235,0.22)] transition-transform duration-120 ${
            currentAction === "run"
              ? "rotate-[8deg] translate-y-0.5"
              : currentAction === "flying_kick" && actionPhase === "impact"
              ? "-translate-y-3 translate-x-2 rotate-[-8deg]"
              : currentAction === "jump_slam" && actionPhase === "windup"
              ? "-translate-y-5"
              : currentAction === "jump_slam" && actionPhase === "impact"
              ? "translate-y-1.5"
              : currentAction === "dodge"
              ? "translate-y-1 rotate-[-12deg]"
              : currentAction === "victory_dance"
              ? danceStep % 2 === 0
                ? "-translate-y-1 rotate-[4deg]"
                : "-translate-y-1 rotate-[-4deg]"
              : ""
          }`}
          fill="none"
        >
          {/* ── LEGS ── */}
          <g stroke="#1658eb" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round">
            {/* 1. RUNNING LEGS (Dynamic running stride cycle) */}
            {currentAction === "run" && (
              <>
                {runFrame % 2 === 0 ? (
                  <>
                    {/* Left Leg Forward Bent */}
                    <path d="M 68 88 L 48 104 L 38 126" />
                    <path d="M 38 126 L 28 127" strokeWidth="4.2" />
                    {/* Right Leg Trailing Back */}
                    <path d="M 72 88 L 90 102 L 106 118" />
                    <path d="M 106 118 L 116 114" strokeWidth="4.2" />
                  </>
                ) : (
                  <>
                    {/* Left Leg Trailing Back */}
                    <path d="M 68 88 L 50 102 L 36 118" />
                    <path d="M 36 118 L 26 114" strokeWidth="4.2" />
                    {/* Right Leg Forward Bent */}
                    <path d="M 72 88 L 88 104 L 98 126" />
                    <path d="M 98 126 L 108 127" strokeWidth="4.2" />
                  </>
                )}
              </>
            )}

            {/* 2. MARTIAL ARTS BAT STANCE & BOXING STANCE */}
            {(currentAction === "bat_swing" || currentAction === "boxing_combo" || currentAction === "spin") && (
              <>
                <path d="M 68 88 L 44 108 L 24 130" />
                <path d="M 24 130 L 14 131" strokeWidth="4.4" />
                <path d="M 72 88 L 94 108 L 112 130" />
                <path d="M 112 130 L 122 131" strokeWidth="4.4" />
              </>
            )}

            {/* 3. FLYING KICK LEGS */}
            {currentAction === "flying_kick" && (
              <>
                {/* Tucked Back Leg */}
                <path d="M 68 88 L 48 102 L 42 90" />
                {/* Extended Horizontal Dropkick Leg */}
                <path d="M 72 88 L 96 84 L 118 82" strokeWidth="4.4" />
                <path d="M 118 82 L 120 74" strokeWidth="4.6" />
              </>
            )}

            {/* 4. JUMP SLAM LEGS */}
            {currentAction === "jump_slam" && (
              <>
                <path d="M 68 88 L 52 104 L 42 120" />
                <path d="M 72 88 L 88 104 L 98 120" />
              </>
            )}

            {/* 5. DODGE LEGS (Springy crouch) */}
            {currentAction === "dodge" && (
              <>
                <path d="M 68 88 L 46 102 L 36 122" />
                <path d="M 72 88 L 84 104 L 92 122" />
              </>
            )}

            {/* 6. VICTORY DANCE LEGS */}
            {currentAction === "victory_dance" && (
              <>
                <path d={danceStep % 2 === 0 ? "M 68 88 L 48 108 L 36 128" : "M 68 88 L 52 102 L 42 120"} />
                <path d={danceStep % 2 === 0 ? "M 72 88 L 88 102 L 98 120" : "M 72 88 L 92 108 L 104 128"} />
              </>
            )}
          </g>

          {/* ── TORSO ── */}
          <line x1="70" y1="48" x2="70" y2="88" stroke="#1658eb" strokeWidth="4" strokeLinecap="round" />

          {/* ── HEAD & FACIAL EXPRESSIONS ── */}
          <g>
            <circle cx="70" cy="32" r="16" fill="#ffffff" stroke="#1658eb" strokeWidth="3.4" />

            {/* Angry determination (Attack, Run, Dodge) vs Laughing Joy (Victory Dance) */}
            {currentAction !== "victory_dance" ? (
              <>
                {/* Angry Slanted Eyebrows (Sketch: >:) */}
                <path d="M 60 26 L 67 31" stroke="#1658eb" strokeWidth="3" strokeLinecap="round" />
                <path d="M 80 26 L 73 31" stroke="#1658eb" strokeWidth="3" strokeLinecap="round" />
                {/* Fierce Eyes */}
                <circle cx="64" cy="33" r="2" fill="#1658eb" />
                <circle cx="76" cy="33" r="2" fill="#1658eb" />
                {/* Angry Downturned Clench */}
                <path d="M 64 41 Q 70 36 76 41" stroke="#1658eb" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                <line x1="67" y1="38" x2="67" y2="41" stroke="#1658eb" strokeWidth="1.6" />
                <line x1="73" y1="38" x2="73" y2="41" stroke="#1658eb" strokeWidth="1.6" />
              </>
            ) : (
              <>
                {/* Laughing Eyes (^‿^) */}
                <path d="M 61 31 Q 65 27 69 31" stroke="#1658eb" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M 71 31 Q 75 27 79 31" stroke="#1658eb" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                {/* Laughing Mouth (Haha!) */}
                <path d="M 63 37 Q 70 45 77 37 Z" fill="#1658eb" />
              </>
            )}
          </g>

          {/* ── ARMS & BAT / PUNCHES ── */}

          {/* 1. BAT SWING / RUNNING / DODGE MODE */}
          {(currentAction === "bat_swing" ||
            currentAction === "run" ||
            currentAction === "dodge" ||
            currentAction === "spin" ||
            (currentAction === "flying_kick" && actionPhase !== "impact")) && (
            <g
              className="transition-transform duration-100 origin-[70px_54px]"
              style={{
                transform:
                  actionPhase === "windup"
                    ? "rotate(-28deg) translate(-3px, 2px)"
                    : actionPhase === "impact"
                    ? "rotate(34deg) translate(5px, -2px)"
                    : currentAction === "run"
                    ? runFrame % 2 === 0
                      ? "rotate(10deg)"
                      : "rotate(-6deg)"
                    : "rotate(0deg)",
              }}
            >
              <path d="M 70 54 L 82 48 L 92 38" stroke="#1658eb" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 70 60 L 86 54 L 96 42" stroke="#1658eb" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="92" cy="38" r="2.8" fill="#1658eb" />
              <circle cx="96" cy="42" r="2.8" fill="#1658eb" />

              {/* Cobalt Baseball Bat with Sleek Elongated Profile */}
              <line x1="88" y1="46" x2="98" y2="34" stroke="#93c5fd" strokeWidth="3.4" strokeLinecap="round" />
              <path
                d="M 95 38 L 130 2 C 135 -3, 140 3, 136 7 L 102 44 Z"
                fill="url(#stickBatGradIntelligent)"
                stroke="#0f4bc9"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path d="M 100 34 L 128 5" stroke="rgba(255,255,255,0.85)" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          )}

          {/* 2. BOXING COMBO MODE */}
          {currentAction === "boxing_combo" && (
            <g>
              <path
                d={punchHand === "left" ? "M 70 54 L 98 52 L 114 52" : "M 70 54 L 82 50 L 89 58"}
                stroke="#1658eb"
                strokeWidth="3.4"
                strokeLinecap="round"
              />
              <circle cx={punchHand === "left" ? 114 : 89} cy={punchHand === "left" ? 52 : 58} r="4.5" fill="#2563eb" stroke="#1658eb" strokeWidth="1.4" />
              <path
                d={punchHand === "right" ? "M 70 60 L 98 62 L 118 62" : "M 70 60 L 82 64 L 90 62"}
                stroke="#1658eb"
                strokeWidth="3.4"
                strokeLinecap="round"
              />
              <circle cx={punchHand === "right" ? 118 : 90} cy={punchHand === "right" ? 62 : 62} r="4.5" fill="#2563eb" stroke="#1658eb" strokeWidth="1.4" />
            </g>
          )}

          {/* 3. JUMP SLAM MODE */}
          {currentAction === "jump_slam" && (
            <g
              className="transition-transform duration-90 origin-[70px_54px]"
              style={{
                transform: actionPhase === "windup" ? "rotate(-80deg) translate(-8px, -12px)" : "rotate(38deg) translate(6px, 5px)",
              }}
            >
              <path d="M 70 54 L 80 36 L 90 24" stroke="#1658eb" strokeWidth="3.4" strokeLinecap="round" />
              <path d="M 70 60 L 82 42 L 92 26" stroke="#1658eb" strokeWidth="3.4" strokeLinecap="round" />
              <path
                d="M 90 26 L 118 -4 C 122 -8, 126 -3, 122 1 L 96 32 Z"
                fill="url(#stickBatGradIntelligent)"
                stroke="#0f4bc9"
                strokeWidth="1.4"
              />
            </g>
          )}

          {/* 4. VICTORY DANCE MODE */}
          {currentAction === "victory_dance" && (
            <g>
              {/* Bat Raised High in Air like a Trophy */}
              <path d="M 70 54 L 80 34 L 92 16" stroke="#1658eb" strokeWidth="3.4" strokeLinecap="round" />
              <circle cx="92" cy="16" r="3" fill="#1658eb" />
              <path
                d="M 92 16 L 105 -14 C 108 -18, 113 -15, 111 -10 L 97 20 Z"
                fill="url(#stickBatGradIntelligent)"
                stroke="#0f4bc9"
                strokeWidth="1.4"
              />
              <path d="M 70 60 L 58 66 L 64 72" stroke="#1658eb" strokeWidth="3.4" strokeLinecap="round" />
            </g>
          )}

          {/* ── Gradients ── */}
          <defs>
            <linearGradient id="stickBatGradIntelligent" x1="90" y1="42" x2="128" y2="5" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1658eb" />
              <stop offset="60%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
