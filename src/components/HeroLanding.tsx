"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Shield,
  Zap,
  Bell,
  Lock,
  Upload,
  ArrowRight,
  Check,
  Loader2,
  AlertCircle,
  X,
  Sparkles,
  ClipboardPaste,
} from "lucide-react";
import { PRESET_SCENARIOS, PresetScenario } from "@/data/presets";
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
  const [scanStep, setScanStep] = useState<number>(0);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<"howItWorks" | "features" | "privacy" | "faq" | "signIn" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const runPresetAnalysis = (preset: PresetScenario) => {
    setError(null);
    setIsAnalyzing(true);
    setScanStep(1);

    setTimeout(() => {
      setScanStep(2);
      setTimeout(() => {
        setScanStep(3);
        setTimeout(() => {
          setIsAnalyzing(false);
          setScanStep(0);
          onAnalyzeComplete(preset.data);
        }, 600);
      }, 600);
    }, 600);
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (.png, .jpg, .webp)");
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setScanStep(1);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = (e.target?.result as string)?.split(",")[1];
        if (!base64Data) {
          setError("Failed to read image file.");
          setIsAnalyzing(false);
          return;
        }

        setScanStep(2);

        try {
          const res = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageBase64: base64Data,
              mimeType: file.type,
            }),
          });

          setScanStep(3);

          const result = await res.json();

          if (!res.ok) {
            setError(result.error || "Analysis failed. Please try a preset or verify your API key.");
            setIsAnalyzing(false);
            return;
          }

          if (!result.isSubscription) {
            setError(
              result.unrecognizedReason ||
                "This doesn't look like a subscription receipt or trial confirmation — couldn't find merchant, billing amount, or renewal terms."
            );
            setIsAnalyzing(false);
            return;
          }

          setTimeout(() => {
            setIsAnalyzing(false);
            setScanStep(0);
            onAnalyzeComplete(result);
          }, 400);
        } catch {
          setError("API request failed. Please check network connection or try a sample preset.");
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setError("Could not read file.");
      setIsAnalyzing(false);
    }
  };

  const handlePasteClick = async () => {
    setError(null);
    try {
      if (!navigator.clipboard?.read) {
        setError("Please press Ctrl + V on your keyboard to paste your screenshot.");
        return;
      }

      const clipboardItems = await navigator.clipboard.read();
      let imageFound = false;

      for (const item of clipboardItems) {
        const imageType = item.types.find((t) => t.startsWith("image/"));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], "clipboard-screenshot.png", { type: imageType });
          handleFile(file);
          imageFound = true;
          break;
        }
      }

      if (!imageFound) {
        setError("No image found in clipboard. Copy a screenshot (Win + Shift + S) and click Paste again, or press Ctrl + V.");
      }
    } catch {
      setError("Please press Ctrl + V on your keyboard to paste your screenshot directly!");
    }
  };

  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            handleFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handleGlobalPaste);
    return () => window.removeEventListener("paste", handleGlobalPaste);
  }, []);

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between relative bg-cover bg-no-repeat overflow-x-hidden"
      style={{
        backgroundImage: "url('/canceltrap-hero.png')",
        backgroundPosition: "left top",
        backgroundSize: "cover",
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFile(e.dataTransfer.files[0]);
        }
      }}
    >
      {/* Hidden File Input for universal trigger */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* Global Drag-and-Drop Active Overlay */}
      {dragActive && (
        <div className="absolute inset-0 z-50 bg-[#1658eb]/20 backdrop-blur-md border-4 border-dashed border-[#1658eb] flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-white/95 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center">
            <Upload className="w-12 h-12 text-[#1658eb] animate-bounce mb-3" />
            <h3 className="text-xl font-bold text-[#0c1b38]">Drop subscription screenshot</h3>
            <p className="text-sm text-[#556987] mt-1">We will immediately analyze dark patterns and direct cancel links</p>
          </div>
        </div>
      )}

      {/* Top Header / Navigation Bar - Logo Centered in the Upper Left Circle Arc */}
      <header className="w-full px-6 sm:px-10 lg:px-14 pt-4 sm:pt-6 pb-2 flex items-start justify-between z-20">
        {/* Brand Logo centered inside the upper-left gradient circle */}
        <div className="pt-6 sm:pt-8 lg:pt-10 pl-2 sm:pl-6 lg:pl-8">
          <Image
            src="/canceltrap-logo.png"
            alt="CancelTrap"
            width={190}
            height={46}
            priority
            className="h-8 sm:h-9 lg:h-10 w-auto object-contain cursor-pointer drop-shadow-sm transition-transform hover:scale-105"
            onClick={() => window.location.reload()}
          />
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#475569]">
          <button
            type="button"
            onClick={() => setActiveModal("howItWorks")}
            className="hover:text-[#1658eb] transition-colors cursor-pointer"
          >
            How it works
          </button>
          <button
            type="button"
            onClick={() => setActiveModal("features")}
            className="hover:text-[#1658eb] transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            type="button"
            onClick={() => setActiveModal("privacy")}
            className="hover:text-[#1658eb] transition-colors cursor-pointer"
          >
            Privacy
          </button>
          <button
            type="button"
            onClick={() => setActiveModal("faq")}
            className="hover:text-[#1658eb] transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Right Sign in button */}
        <div>
          <button
            type="button"
            onClick={() => setActiveModal("signIn")}
            className="px-6 py-2 rounded-full border border-[#1658eb]/50 text-[#1658eb] text-sm font-semibold hover:bg-blue-50/70 hover:border-[#1658eb] transition-all cursor-pointer shadow-xs"
          >
            Sign in
          </button>
        </div>
      </header>

      {/* Main Hero Section: Left Copy & Right Interactive 3D phone zone */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex flex-col lg:flex-row items-center justify-between relative z-10 py-8 lg:py-12">
        {/* Left Column: Clean, high-impact copy matching mockup */}
        <div className="w-full lg:max-w-xl xl:max-w-2xl text-left flex flex-col justify-center space-y-5">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e8f7ee] border border-[#a7e8be] text-[#0f8b3c] text-xs font-semibold w-fit shadow-xs">
            <Shield className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Take control of subscriptions</span>
          </div>

          {/* Short, Punchy Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#0c1b38] font-display tracking-tight leading-[1.12]">
            Stop paying for <br />
            <span className="text-[#1658eb]">subscriptions</span> you <span className="text-[#15a24a]">forgot</span>.
          </h1>

          {/* Clean, Jargonless Tagline (Max 2 lines) */}
          <p className="text-base sm:text-lg text-[#556987] font-normal leading-relaxed max-w-lg">
            Upload a receipt or trial email to find the cancellation page and set a reminder before renewal.
          </p>

          {/* Clean CTA Row without redundant paste button */}
          <div className="flex flex-wrap items-center gap-5 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-7 py-3.5 rounded-full bg-[#1658eb] hover:bg-[#1246c4] text-white font-semibold text-sm sm:text-base inline-flex items-center gap-2.5 shadow-[0_10px_25px_-5px_rgba(22,88,235,0.35)] hover:shadow-[0_15px_30px_-5px_rgba(22,88,235,0.45)] transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Upload className="w-4 h-4 stroke-[2.5]" />
              <span>Find my subscription</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("howItWorks")}
              className="text-[#1658eb] hover:text-[#1246c4] font-semibold text-sm sm:text-base inline-flex items-center gap-1.5 transition-colors cursor-pointer group"
            >
              <span>How it works</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Trust Line */}
          <div className="flex items-center gap-2 text-xs text-[#556987] pt-1">
            <Lock className="w-3.5 h-3.5 text-[#15a24a] stroke-[2.5]" />
            <span>Your data is safe &amp; private</span>
          </div>

          {/* Error Alert if any */}
          {error && (
            <div className="mt-3 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-[#df202e] max-w-md animate-in fade-in">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#df202e]" />
              <div className="flex-1 leading-relaxed">{error}</div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Seamless Interactive Hotspot over the 3D phone graphic */}
        <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end relative min-h-[380px] lg:min-h-[460px]">
          {/* Active AI Scanning Overlay Card when analyzing */}
          {isAnalyzing ? (
            <div className="w-full max-w-md p-7 rounded-3xl bg-white/95 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(22,88,235,0.25)] border border-white animate-in zoom-in-95 duration-200 z-30">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1658eb] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 animate-pulse text-[#1658eb]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0c1b38] text-base">Gemini 3.8 Flash Analyzing</h3>
                  <p className="text-xs text-[#556987]">Defusing subscription trap in real time</p>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <div
                  className={`flex items-center space-x-3 p-3 rounded-2xl border transition-all ${
                    scanStep >= 1
                      ? "bg-emerald-50/70 border-emerald-300/50 text-[#0c1b38]"
                      : "bg-slate-50 border-transparent text-[#556987]"
                  }`}
                >
                  {scanStep > 1 ? (
                    <Check className="w-4 h-4 text-[#15a24a] stroke-[3]" />
                  ) : (
                    <Loader2 className="w-4 h-4 text-[#1658eb] animate-spin" />
                  )}
                  <span className="text-xs font-semibold">Reading screenshot &amp; OCR</span>
                </div>

                <div
                  className={`flex items-center space-x-3 p-3 rounded-2xl border transition-all ${
                    scanStep >= 2
                      ? "bg-emerald-50/70 border-emerald-300/50 text-[#0c1b38]"
                      : "bg-slate-50 border-transparent text-[#556987]"
                  }`}
                >
                  {scanStep > 2 ? (
                    <Check className="w-4 h-4 text-[#15a24a] stroke-[3]" />
                  ) : scanStep === 2 ? (
                    <Loader2 className="w-4 h-4 text-[#1658eb] animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300" />
                  )}
                  <span className="text-xs font-semibold">Detecting merchant &amp; renewal terms</span>
                </div>

                <div
                  className={`flex items-center space-x-3 p-3 rounded-2xl border transition-all ${
                    scanStep >= 3
                      ? "bg-emerald-50/70 border-emerald-300/50 text-[#0c1b38]"
                      : "bg-slate-50 border-transparent text-[#556987]"
                  }`}
                >
                  {scanStep === 3 ? (
                    <Loader2 className="w-4 h-4 text-[#1658eb] animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300" />
                  )}
                  <span className="text-xs font-semibold">Dissecting dark patterns &amp; kill-switch</span>
                </div>
              </div>
            </div>
          ) : (
            /* Interactive Hotspot over the 3D phone screen in the background */
            <div className="w-[300px] h-[380px] lg:w-[360px] lg:h-[440px] relative flex flex-col items-center justify-center group">
              {/* Minimal compact glass card: takes minimal space, fitted to the phone screen */}
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100 p-2 rounded-2xl bg-white/45 backdrop-blur-md border border-white/85 shadow-[0_12px_28px_-8px_rgba(22,88,235,0.25)] flex flex-col items-center z-10 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2.5 px-5 rounded-xl bg-[#1658eb] hover:bg-[#1246c4] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload screenshot</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Features Strip: Translucent frosted glass, quiet, not white, and non-blue icons */}
      <footer className="w-full bg-white/20 backdrop-blur-xl border-t border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] py-3 px-6 sm:px-12 lg:px-16 z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/40">
          {/* Item 1: Save money */}
          <div className="flex items-center gap-3 py-2 md:py-0 md:px-8 first:pl-0">
            <div className="w-8 h-8 rounded-lg bg-white/40 backdrop-blur-md border border-white/60 text-[#556987] flex items-center justify-center shrink-0">
              <Zap className="w-3.5 h-3.5 text-[#556987]" />
            </div>
            <div>
              <h4 className="font-semibold text-[#0c1b38]/85 text-xs sm:text-sm">Save money</h4>
              <p className="text-[11px] sm:text-xs text-[#556987]/80 mt-0.5 leading-snug">
                Avoid surprise charges and unwanted renewals.
              </p>
            </div>
          </div>

          {/* Item 2: Save time */}
          <div className="flex items-center gap-3 py-2 md:py-0 md:px-8">
            <div className="w-8 h-8 rounded-lg bg-white/40 backdrop-blur-md border border-white/60 text-[#556987] flex items-center justify-center shrink-0">
              <Shield className="w-3.5 h-3.5 text-[#556987]" />
            </div>
            <div>
              <h4 className="font-semibold text-[#0c1b38]/85 text-xs sm:text-sm">Save time</h4>
              <p className="text-[11px] sm:text-xs text-[#556987]/80 mt-0.5 leading-snug">
                Get to the exact cancellation page in seconds.
              </p>
            </div>
          </div>

          {/* Item 3: Stay in control */}
          <div className="flex items-center gap-3 py-2 md:py-0 md:px-8 last:pr-0">
            <div className="w-8 h-8 rounded-lg bg-white/40 backdrop-blur-md border border-white/60 text-[#556987] flex items-center justify-center shrink-0">
              <Bell className="w-3.5 h-3.5 text-[#556987]" />
            </div>
            <div>
              <h4 className="font-semibold text-[#0c1b38]/85 text-xs sm:text-sm">Stay in control</h4>
              <p className="text-[11px] sm:text-xs text-[#556987]/80 mt-0.5 leading-snug">
                Set reminders and never forget again.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Helpful Interactive Modals for Top Nav Links */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 shadow-2xl border border-slate-100 relative animate-in zoom-in-95">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === "howItWorks" && (
              <div>
                <h3 className="text-xl font-bold text-[#0c1b38] mb-3">How CancelTrap Works</h3>
                <div className="space-y-3 text-sm text-[#556987]">
                  <p><strong>1. Upload or Paste:</strong> Drop any trial confirmation, billing receipt, or account settings screenshot (or press Ctrl+V).</p>
                  <p><strong>2. Multimodal Scan:</strong> Gemini 3.8 Flash extracts the merchant name, renewal deadline, and recurring price.</p>
                  <p><strong>3. Dark-Pattern Defusal:</strong> We pinpoint sneaky decoy buttons (like &quot;Pause&quot; or &quot;Switch to Annual&quot;) and give you the direct cancellation link.</p>
                  <p><strong>4. Kill-Switch Reminder:</strong> Generate a one-click calendar reminder (.ics) set 48 hours before renewal.</p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-[#0c1b38] block mb-2">Or test an instant sample scan:</span>
                  <div className="flex gap-2 flex-wrap">
                    {PRESET_SCENARIOS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setActiveModal(null);
                          runPresetAnalysis(preset);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#e8f1fd] text-[#1658eb] hover:bg-[#d6e7fc] text-xs font-semibold transition-all cursor-pointer"
                      >
                        {preset.id === "adobe" ? "Adobe Annual Trap" : preset.id === "lovable" ? "Lovable Pro" : "7-Day AI Trial"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeModal === "features" && (
              <div>
                <h3 className="text-xl font-bold text-[#0c1b38] mb-3">Core Features</h3>
                <div className="space-y-3 text-sm text-[#556987]">
                  <p>🛡️ <strong>Direct Portal Deep-Links:</strong> Direct links to vendor cancellation centers without navigating nested menus.</p>
                  <p>⚠️ <strong>Decoy Button Warnings:</strong> Clear indicators of dark patterns designed to trick you into staying subscribed.</p>
                  <p>📈 <strong>5-Year Vampire Bleed:</strong> See how much this subscription drains from your wallet over 5 years.</p>
                  <p>📅 <strong>RFC 5545 Calendar Kill-Switch:</strong> Works natively with Google Calendar, Apple Calendar, and Outlook.</p>
                </div>
              </div>
            )}

            {activeModal === "privacy" && (
              <div>
                <h3 className="text-xl font-bold text-[#0c1b38] mb-3">Privacy First</h3>
                <p className="text-sm text-[#556987] leading-relaxed">
                  CancelTrap does not require you to connect your bank account or credit card. Screenshots are processed in-memory directly via the Gemini API and are never stored in any database.
                </p>
              </div>
            )}

            {activeModal === "faq" && (
              <div>
                <h3 className="text-xl font-bold text-[#0c1b38] mb-3">Frequently Asked Questions</h3>
                <div className="space-y-3 text-sm text-[#556987]">
                  <p><strong>Do I need to create an account?</strong><br />No account is required. Everything works on-demand.</p>
                  <p><strong>What file formats are supported?</strong><br />PNG, JPEG, and WebP receipts or screenshots up to 10 MB.</p>
                  <p><strong>Can I use it on mobile?</strong><br />Yes, take a screenshot of your subscription and upload it directly from your phone.</p>
                </div>
              </div>
            )}

            {activeModal === "signIn" && (
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#15a24a] flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0c1b38] mb-2">No Account Required</h3>
                <p className="text-sm text-[#556987] leading-relaxed mb-5">
                  CancelTrap is built with zero lock-in and zero friction. You can defuse any subscription immediately without signing in or sharing financial credentials.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    fileInputRef.current?.click();
                  }}
                  className="w-full py-3 rounded-full bg-[#1658eb] text-white font-semibold text-sm hover:bg-[#1246c4] cursor-pointer"
                >
                  Upload a screenshot now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
