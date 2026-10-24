"use client";

import React, { useState } from "react";
import { Upload, ShieldCheck, AlertCircle, Check, Loader2, FileText } from "lucide-react";
import { PRESET_SCENARIOS, PresetScenario } from "@/data/presets";
import { SubscriptionDefusalResponse } from "@/lib/types";

interface UploadCardProps {
  onAnalyzeComplete: (data: SubscriptionDefusalResponse) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export function UploadCard({
  onAnalyzeComplete,
  isAnalyzing,
  setIsAnalyzing,
  error,
  setError,
}: UploadCardProps) {
  const [scanStep, setScanStep] = useState<number>(0);
  const [dragActive, setDragActive] = useState<boolean>(false);

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

  return (
    <div className="flex flex-col items-center">
      {/* Main Opaque Card (Risklyte pixel-match) */}
      <div className="w-full sm:w-102.5 p-8 rounded-[28px] bg-white/95 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(17,51,138,0.22)] border border-white transition-all relative">
        {/* Card Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-[#0f1e3b]">
            Upload <span className="text-[#11338a]">Subscription</span>
          </h2>
          <p className="text-sm text-[#54657a] mt-1.5">
            Drop your receipt or screenshot and we&apos;ll do the rest.
          </p>
        </div>

        {/* Main Content Area */}
        {isAnalyzing ? (
          <div className="py-8 px-2 flex flex-col space-y-3.5">
            <div
              className={`flex items-center space-x-3 p-3.5 rounded-2xl border transition-all ${
                scanStep >= 1
                  ? "bg-emerald-50/70 border-emerald-300/50 text-[#0f1e3b]"
                  : "bg-slate-50 border-transparent text-[#54657a]"
              }`}
            >
              {scanStep > 1 ? (
                <Check className="w-4 h-4 text-[#54b66e] stroke-3" />
              ) : (
                <Loader2 className="w-4 h-4 text-[#11338a] animate-spin" />
              )}
              <span className="text-xs font-semibold">Reading screenshot &amp; OCR</span>
            </div>

            <div
              className={`flex items-center space-x-3 p-3.5 rounded-2xl border transition-all ${
                scanStep >= 2
                  ? "bg-emerald-50/70 border-emerald-300/50 text-[#0f1e3b]"
                  : "bg-slate-50 border-transparent text-[#54657a]"
              }`}
            >
              {scanStep > 2 ? (
                <Check className="w-4 h-4 text-[#54b66e] stroke-3" />
              ) : scanStep === 2 ? (
                <Loader2 className="w-4 h-4 text-[#11338a] animate-spin" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300" />
              )}
              <span className="text-xs font-semibold">Detecting merchant &amp; renewal terms</span>
            </div>

            <div
              className={`flex items-center space-x-3 p-3.5 rounded-2xl border transition-all ${
                scanStep >= 3
                  ? "bg-emerald-50/70 border-emerald-300/50 text-[#0f1e3b]"
                  : "bg-slate-50 border-transparent text-[#54657a]"
              }`}
            >
              {scanStep === 3 ? (
                <Loader2 className="w-4 h-4 text-[#11338a] animate-spin" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300" />
              )}
              <span className="text-xs font-semibold">Dissecting dark patterns &amp; kill-switch</span>
            </div>
          </div>
        ) : (
          <>
            {/* Dashed Dropzone with subtle green glow (Risklyte match) */}
            <div
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
              className={`border-2 border-dashed rounded-2xl p-7 text-center transition-all cursor-pointer relative overflow-hidden ${
                dragActive
                  ? "border-[#11338a] bg-blue-50/80 scale-[1.01]"
                  : "border-[#b5d6f3] hover:border-[#11338a]/60 bg-linear-to-b from-emerald-50/30 via-sky-50/20 to-white"
              }`}
              onClick={() => document.getElementById("receipt-input")?.click()}
            >
              <input
                id="receipt-input"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />

              <div className="w-10 h-10 mx-auto mb-2.5 rounded-xl bg-white shadow-sm border border-emerald-100 flex items-center justify-center text-[#54b66e]">
                <FileText className="w-5 h-5 text-[#54b66e]" />
              </div>

              <p className="font-bold text-[#0f1e3b] text-sm">
                Drag &amp; drop your .png / .jpg file
              </p>
              <p className="text-xs text-[#54657a] mt-1">
                or click to browse &middot; up to 10 MB
              </p>
            </div>

            {/* Inline Error Alert (Risklyte match) */}
            {error && (
              <div className="mt-4 p-3.5 rounded-2xl bg-red-50 border border-red-200/80 flex items-start space-x-2.5 text-left text-xs text-[#df202e] animate-in fade-in">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#df202e]" />
                <div className="flex-1 leading-relaxed">{error}</div>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => document.getElementById("receipt-input")?.click()}
              className="w-full mt-5 py-3 px-6 rounded-2xl bg-[#11338a] hover:bg-[#1640ad] text-white font-semibold text-sm flex items-center justify-center space-x-2 transition-all shadow-[0_10px_24px_-10px_rgba(17,51,138,0.7)] hover:shadow-lg cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Choose screenshot</span>
            </button>

            {/* Sample presets - clean chips row */}
            <div className="mt-5 pt-3 border-t border-slate-100 text-center">
              <span className="text-[11px] text-[#54657a] font-medium block mb-2">
                Or try a sample receipt:
              </span>
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {PRESET_SCENARIOS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => runPresetAnalysis(preset)}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-[11px] font-medium text-[#11338a] hover:border-[#11338a]/40 transition-all cursor-pointer"
                  >
                    {preset.id === "adobe" ? "Adobe Trap" : preset.id === "lovable" ? "Lovable Pro" : "7-Day AI"}
                  </button>
                ))}
              </div>
            </div>

            {/* Security Indicator */}
            <div className="mt-4 text-center flex items-center justify-center space-x-1.5 text-xs text-[#54657a]">
              <ShieldCheck className="w-4 h-4 text-[#54b66e]" />
              <span>Processed privately on your device</span>
            </div>
          </>
        )}
      </div>

      {/* Floating Copyright Pill (Risklyte match) */}
      <div className="mt-4">
        <span className="text-xs text-[#54657a] py-1.5 px-4 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-sm inline-block">
          &copy; 2026 CancelTrap &middot; All rights reserved
        </span>
      </div>
    </div>
  );
}
