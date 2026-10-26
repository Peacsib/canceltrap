"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Shield,
  Zap,
  Clock,
  Upload,
  Search,
  ArrowRight,
  Check,
  Loader2,
  AlertCircle,
  X,
  Sparkles,
  ShieldAlert,
  Compass,
  Calendar,
  DollarSign,
} from "lucide-react";
import { PRESET_SCENARIOS, PresetScenario } from "@/data/presets";
import { SubscriptionDefusalResponse } from "@/lib/types";
import { CleanWaterMotionBg } from "./CleanWaterMotionBg";
import { BasketServices } from "./BasketServices";

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
  const router = useRouter();
  const [scanStep, setScanStep] = useState<number>(0);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<"howItWorks" | "features" | "privacy" | "faq" | null>(null);
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
          if (typeof window !== "undefined") {
            try {
              sessionStorage.setItem("canceltrap_active_scan", JSON.stringify(preset.data));
            } catch { }
          }
          router.push(`/dashboard?service=${preset.id}`);
          onAnalyzeComplete(preset.data);
        }, 600);
      }, 600);
    }, 600);
  };

  const handleFile = useCallback(async (file: File) => {
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
            if (typeof window !== "undefined") {
              try {
                sessionStorage.setItem("canceltrap_active_scan", JSON.stringify(result));
              } catch { }
            }
            const sKey = result.merchant?.name ? encodeURIComponent(result.merchant.name.toLowerCase()) : "google_cloud";
            router.push(`/dashboard?service=${sKey}`);
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
  }, [onAnalyzeComplete, setError, setIsAnalyzing, router]);

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
  }, [handleFile]);

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between relative overflow-x-hidden"
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
      {/* Pristine Animated Water-Blue Motion Background */}
      <CleanWaterMotionBg />
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

      {/* Top Header / Navigation Bar */}
      <header className="w-full px-4 sm:px-8 lg:px-12 py-3 sm:py-4 flex items-center justify-between z-20">
        {/* Brand Logo - Nestled cleanly inside the upper-left gradient circle as a refined glass capsule */}
        <div className="flex items-center">
          <div
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-2.5 rounded-full bg-white/90 backdrop-blur-xl border border-white shadow-[0_10px_25px_-5px_rgba(15,30,59,0.14),0_2px_6px_rgba(0,0,0,0.04)] ring-1 ring-black/5 hover:-translate-y-1 hover:shadow-[0_18px_38px_-6px_rgba(22,88,235,0.3),0_0_24px_rgba(22,88,235,0.18)] hover:border-[#1658eb]/40 hover:bg-white active:scale-95 transition-all duration-300 cursor-pointer group"
          >
            <Image
              src="/canceltrap-logo.webp"
              alt="CancelTrap"
              width={180}
              height={45}
              priority
              className="h-6.5 sm:h-8.5 w-auto object-contain transition-transform group-hover:scale-[1.03]"
            />
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#475569]">
          <button
            type="button"
            onClick={() => setActiveModal("howItWorks")}
            className="nav-link-illuminated font-semibold cursor-pointer"
          >
            How it works
          </button>
          <button
            type="button"
            onClick={() => setActiveModal("features")}
            className="nav-link-illuminated font-semibold cursor-pointer"
          >
            Features
          </button>
          <button
            type="button"
            onClick={() => setActiveModal("privacy")}
            className="nav-link-illuminated font-semibold cursor-pointer"
          >
            Privacy
          </button>
          <button
            type="button"
            onClick={() => setActiveModal("faq")}
            className="nav-link-illuminated font-semibold cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Right Action Button - Vertically centered with logo on all screens */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="btn-illuminate-primary px-4 py-2 sm:px-5 sm:py-2 rounded-full text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Hero Section: Split into distinct Left and Right halves with a visible middle line */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-12 lg:px-16 flex flex-col lg:flex-row items-center justify-between relative z-10 py-2 sm:py-4 lg:py-10 gap-4 lg:gap-0">
        {/* Hero Left Column: Brand promise, headline & CTA (Flows naturally on mobile into stick fighter) */}
        <div className="w-full lg:w-[48%] xl:w-[46%] text-left flex flex-col justify-center space-y-3 sm:space-y-4 pr-0 lg:pr-8 xl:pr-12 pt-1 pb-2 lg:py-0">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#e8f7ee]/90 backdrop-blur-md border border-[#a7e8be] text-[#0f8b3c] text-xs font-semibold w-fit shadow-xs interactive-pill hover:border-[#0f8b3c]/50 hover:shadow-[0_6px_20px_rgba(15,139,60,0.22)] staged-enter staged-delay-1">
            <Shield className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Take control of subscriptions</span>
          </div>

          {/* Short, Punchy Headline - calibrated size for clean 2 columns */}
          <h1 className="text-xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-extrabold text-[#0c1b38] font-display tracking-tight leading-tight staged-enter staged-delay-2">
            Stop paying for <br className="hidden sm:inline" />
            <span className="text-[#1658eb] headline-radiance-blue">subscriptions</span> you{" "}
            <span className="text-[#15a24a] headline-radiance-green">forgot</span>.
          </h1>

          {/* Clean, Jargonless Tagline (Max 2 lines) */}
          <p className="text-xs sm:text-base text-[#556987] font-normal leading-relaxed max-w-md staged-enter staged-delay-3">
            Stop unwanted renewals before they cost you more. Get to the right cancellation page without digging through menus.
          </p>

          {/* Desktop Clean CTA Row */}
          <div className="hidden lg:flex flex-wrap items-center gap-3 sm:gap-4 pt-1 staged-enter staged-delay-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="btn-illuminate-primary px-6 py-3 sm:px-7 sm:py-3.5 rounded-full font-bold text-xs sm:text-base inline-flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              <span>Find my subscription</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("howItWorks")}
              className="btn-illuminate-ghost px-4 py-2.5 sm:px-5 sm:py-3 rounded-full text-[#1658eb] font-semibold text-xs sm:text-base inline-flex items-center gap-1.5 transition-all cursor-pointer group"
            >
              <span>How it works</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
            </button>
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

        {/* Visible Middle Split Line: Distinct boundary separating Hero Left from Hero Right */}
        <div className="hidden lg:block w-[1.5px] h-80 xl:h-90 bg-linear-to-b from-transparent via-[#1658eb]/25 to-transparent shrink-0 my-auto shadow-[0_0_8px_rgba(22,88,235,0.12)] staged-enter staged-delay-5" />

        {/* Hero Right Column: 3D glass chair showcase & stick fighter interactive arena */}
        <div className="w-full lg:w-[48%] xl:w-[50%] flex items-center justify-center lg:translate-x-24 xl:translate-x-32 lg:-translate-y-4 xl:-translate-y-5 relative min-h-0 py-2 sm:py-6 lg:py-0 staged-enter staged-delay-6">
          {/* Active AI Scanning Overlay Card when analyzing */}
          {isAnalyzing ? (
            <div className="w-full max-w-md p-7 rounded-3xl bg-white/95 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(22,88,235,0.25)] border border-white animate-in zoom-in-95 duration-200 z-30">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1658eb] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 animate-pulse text-[#1658eb]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0c1b38] text-base">Scanning Screenshot</h3>
                  <p className="text-xs text-[#556987]">Defusing subscription trap in real time</p>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <div
                  className={`flex items-center space-x-3 p-3 rounded-2xl border transition-all ${scanStep >= 1
                      ? "bg-emerald-50/70 border-emerald-300/50 text-[#0c1b38]"
                      : "bg-slate-50 border-transparent text-[#556987]"
                    }`}
                >
                  {scanStep > 1 ? (
                    <Check className="w-4 h-4 text-[#15a24a] stroke-3" />
                  ) : (
                    <Loader2 className="w-4 h-4 text-[#1658eb] animate-spin" />
                  )}
                  <span className="text-xs font-semibold">Reading screenshot &amp; OCR</span>
                </div>

                <div
                  className={`flex items-center space-x-3 p-3 rounded-2xl border transition-all ${scanStep >= 2
                      ? "bg-emerald-50/70 border-emerald-300/50 text-[#0c1b38]"
                      : "bg-slate-50 border-transparent text-[#556987]"
                    }`}
                >
                  {scanStep > 2 ? (
                    <Check className="w-4 h-4 text-[#15a24a] stroke-3" />
                  ) : scanStep === 2 ? (
                    <Loader2 className="w-4 h-4 text-[#1658eb] animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300" />
                  )}
                  <span className="text-xs font-semibold">Detecting merchant &amp; renewal terms</span>
                </div>

                <div
                  className={`flex items-center space-x-3 p-3 rounded-2xl border transition-all ${scanStep >= 3
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
            /* Glass Basket holding 10 services - calibrated compact scale on mobile */
            <div className="w-full flex items-center justify-center scale-[0.68] sm:scale-85 lg:scale-100 origin-center -my-8 sm:my-0">
              <BasketServices
                onSelectService={(serviceId) => router.push(`/dashboard?service=${serviceId}`)}
              />
            </div>
          )}
        </div>

        {/* Mobile CTA Row: Sleek single horizontal row positioned cleanly beneath the arena */}
        <div className="lg:hidden w-full flex items-center justify-center gap-2.5 px-4 pt-1 pb-4 z-20 staged-enter staged-delay-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="btn-illuminate-primary flex-1 max-w-52.5 px-5 py-2.5 rounded-full font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-98"
          >
            <Search className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Find subscription</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={() => setActiveModal("howItWorks")}
            className="btn-illuminate-ghost px-4 py-2.5 rounded-full text-[#1658eb] font-semibold text-xs inline-flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
          >
            <span>How it works</span>
          </button>
        </div>
      </div>

      {/* Bottom Features Strip: Hidden on mobile per design spec */}
      <footer className="hidden md:block w-full bg-white/10 backdrop-blur-[2px] border-t border-sky-100/40 py-2.5 px-6 sm:px-12 lg:px-16 z-20 staged-enter staged-delay-7">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
          {/* Item 1: Save money */}
          <div className="flex items-center gap-3 flex-1 cursor-default opacity-80 hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white/50 border border-sky-200/50 flex items-center justify-center shrink-0 text-sky-600">
              <Zap className="w-3.5 h-3.5 text-[#1658eb]/80" />
            </div>
            <div>
              <h4 className="font-semibold text-[#0c1b38]/80 text-xs sm:text-sm">
                Save money
              </h4>
              <p className="text-[11px] text-[#556987]/75 leading-tight font-normal">
                Avoid surprise charges and unwanted renewals.
              </p>
            </div>
          </div>

          {/* Subtle Vertical Divider 1 */}
          <div className="hidden md:block w-px h-5 bg-sky-200/35 self-center shrink-0" />

          {/* Item 2: Save time */}
          <div className="flex items-center gap-3 flex-1 cursor-default opacity-80 hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white/50 border border-sky-200/50 flex items-center justify-center shrink-0 text-sky-600">
              <Clock className="w-3.5 h-3.5 text-[#1658eb]/80 stroke-2" />
            </div>
            <div>
              <h4 className="font-semibold text-[#0c1b38]/80 text-xs sm:text-sm">
                Save time
              </h4>
              <p className="text-[11px] text-[#556987]/75 leading-tight font-normal">
                Get to the exact cancellation page in seconds.
              </p>
            </div>
          </div>

          {/* Subtle Vertical Divider 2 */}
          <div className="hidden md:block w-px h-5 bg-sky-200/35 self-center shrink-0" />

          {/* Item 3: Stay in control */}
          <div className="flex items-center gap-3 flex-1 cursor-default opacity-80 hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white/50 border border-sky-200/50 flex items-center justify-center shrink-0 text-sky-600">
              <Shield className="w-3.5 h-3.5 text-[#1658eb]/80 stroke-2" />
            </div>
            <div>
              <h4 className="font-semibold text-[#0c1b38]/80 text-xs sm:text-sm">
                Stay in control
              </h4>
              <p className="text-[11px] text-[#556987]/75 leading-tight font-normal">
                Set reminders and never forget again.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Helpful Interactive Modals for Top Nav Links */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-lg w-full p-7 shadow-[0_30px_70px_-15px_rgba(15,30,59,0.35)] border border-white relative animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 active:scale-90 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === "howItWorks" && (
              <div>
                <h3 className="text-xl font-bold text-[#0c1b38] mb-4">How CancelTrap Works</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-white/70 border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200/80 text-[#1658eb] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="text-xs sm:text-sm">
                      <strong className="text-[#0c1b38] font-semibold block mb-0.5">Search your service</strong>
                      <span className="text-[#556987] leading-relaxed">Type any subscription provider (Netflix, Adobe, AWS, ChatGPT, etc.) in the dashboard search bar.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-white/70 border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200/80 text-[#1658eb] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="text-xs sm:text-sm">
                      <strong className="text-[#0c1b38] font-semibold block mb-0.5">Get the direct route</strong>
                      <span className="text-[#556987] leading-relaxed">CancelTrap surfaces the exact cancellation page URL, bypassing nested menus and dark-pattern decoys.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-white/70 border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200/80 text-[#1658eb] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="text-xs sm:text-sm">
                      <strong className="text-[#0c1b38] font-semibold block mb-0.5">See what to watch for</strong>
                      <span className="text-[#556987] leading-relaxed">Clear warnings flag tricky buttons (like &quot;Pause&quot; or &quot;Switch to Annual&quot;) that keep you locked in.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-white/70 border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200/80 text-[#1658eb] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </div>
                    <div className="text-xs sm:text-sm">
                      <strong className="text-[#0c1b38] font-semibold block mb-0.5">Set a reminder</strong>
                      <span className="text-[#556987] leading-relaxed">Add a 1-click calendar reminder so you never miss a trial renewal deadline again.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-[#0c1b38] block mb-2">Jump to a quick demo:</span>
                  <div className="flex gap-2 flex-wrap">
                    {PRESET_SCENARIOS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setActiveModal(null);
                          runPresetAnalysis(preset);
                        }}
                        className="btn-illuminate-ghost px-3.5 py-2 rounded-xl text-xs font-bold text-[#1658eb] hover:border-[#1658eb]/50 transition-all cursor-pointer"
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
                <h3 className="text-xl font-bold text-[#0c1b38] mb-4">Core Features</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-blue-50/50 border border-blue-100/60 transition hover:bg-blue-50/80">
                    <div className="w-8 h-8 rounded-xl bg-blue-100/80 border border-blue-200/60 flex items-center justify-center shrink-0 mt-0.5 text-[#1658eb] shadow-2xs">
                      <Search className="w-4 h-4" />
                    </div>
                    <div className="text-xs sm:text-sm">
                      <strong className="text-[#0c1b38] font-semibold block mb-0.5">Instant Service Search</strong>
                      <span className="text-[#556987] leading-relaxed">Search 50+ major subscription providers and get the direct cancellation URL in seconds.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-amber-50/50 border border-amber-100/60 transition hover:bg-amber-50/80">
                    <div className="w-8 h-8 rounded-xl bg-amber-100/80 border border-amber-200/60 flex items-center justify-center shrink-0 mt-0.5 text-amber-600 shadow-2xs">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div className="text-xs sm:text-sm">
                      <strong className="text-[#0c1b38] font-semibold block mb-0.5">Dark Pattern Warnings</strong>
                      <span className="text-[#556987] leading-relaxed">Clear callouts for deceptive UI tricks (fake &quot;Cancel&quot; buttons, forced annual lock-ins, hidden pause loops).</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-sky-50/50 border border-sky-100/60 transition hover:bg-sky-50/80">
                    <div className="w-8 h-8 rounded-xl bg-sky-100/80 border border-sky-200/60 flex items-center justify-center shrink-0 mt-0.5 text-sky-600 shadow-2xs">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div className="text-xs sm:text-sm">
                      <strong className="text-[#0c1b38] font-semibold block mb-0.5">Step-by-Step Navigation</strong>
                      <span className="text-[#556987] leading-relaxed">An exact click-path guide from login to confirmation, so you never get lost mid-flow.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/60 transition hover:bg-indigo-50/80">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100/80 border border-indigo-200/60 flex items-center justify-center shrink-0 mt-0.5 text-indigo-600 shadow-2xs">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="text-xs sm:text-sm">
                      <strong className="text-[#0c1b38] font-semibold block mb-0.5">1-Click Calendar Reminder</strong>
                      <span className="text-[#556987] leading-relaxed">Download a .ics reminder for Google Calendar, Apple Calendar, or Outlook — set before your trial expires.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-emerald-50/50 border border-emerald-100/60 transition hover:bg-emerald-50/80">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100/80 border border-emerald-200/60 flex items-center justify-center shrink-0 mt-0.5 text-emerald-600 shadow-2xs">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div className="text-xs sm:text-sm">
                      <strong className="text-[#0c1b38] font-semibold block mb-0.5">Cost Projection</strong>
                      <span className="text-[#556987] leading-relaxed">See what forgetting this subscription costs you over 1, 2, and 5 years.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeModal === "privacy" && (
              <div>
                <h3 className="text-xl font-bold text-[#0c1b38] mb-3">Privacy First</h3>
                <p className="text-sm text-[#556987] leading-relaxed">
                  CancelTrap does not require you to connect your bank account or credit card. Screenshots are processed securely in-memory and are never stored in any database.
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
          </div>
        </div>
      )}
    </div>
  );
}

