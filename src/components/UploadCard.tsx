"use client";

import React, { useState } from "react";
import { Upload, ShieldCheck, AlertCircle, Check, Loader2, Sparkles, FileText } from "lucide-react";
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

  // Trigger simulated scanning animation sequence for presets
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
          // If server API route is not yet configured or fails, fallback gracefully
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
    <div className="glass-card w-full max-w-[460px] p-8 transition-all duration-300 relative overflow-hidden">
      {/* Card Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-[#0f1e3b]">
          Upload <span className="text-[#11338a]">Subscription</span>
        </h2>
        <p className="text-sm text-[#54657a] mt-1.5">
          Drop your receipt or billing screenshot and we&apos;ll disarm it.
        </p>
      </div>

      {/* Main Interactive Area */}
      {isAnalyzing ? (
        <div className="py-8 px-4 flex flex-col space-y-4">
          <div
            className={`flex items-center space-x-3 p-3.5 rounded-xl border transition-all ${
              scanStep >= 1
                ? "bg-white/80 border-[#54b66e]/40 text-[#0f1e3b]"
                : "bg-white/30 border-transparent text-[#54657a]"
            }`}
          >
            {scanStep > 1 ? (
              <Check className="w-5 h-5 text-[#54b66e]" />
            ) : (
              <Loader2 className="w-5 h-5 text-[#11338a] animate-spin" />
            )}
            <span className="text-sm font-medium">Reading screenshot & OCR</span>
          </div>

          <div
            className={`flex items-center space-x-3 p-3.5 rounded-xl border transition-all ${
              scanStep >= 2
                ? "bg-white/80 border-[#54b66e]/40 text-[#0f1e3b]"
                : "bg-white/30 border-transparent text-[#54657a]"
            }`}
          >
            {scanStep > 2 ? (
              <Check className="w-5 h-5 text-[#54b66e]" />
            ) : scanStep === 2 ? (
              <Loader2 className="w-5 h-5 text-[#11338a] animate-spin" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
            )}
            <span className="text-sm font-medium">Detecting merchant & renewal terms</span>
          </div>

          <div
            className={`flex items-center space-x-3 p-3.5 rounded-xl border transition-all ${
              scanStep >= 3
                ? "bg-white/80 border-[#54b66e]/40 text-[#0f1e3b]"
                : "bg-white/30 border-transparent text-[#54657a]"
            }`}
          >
            {scanStep === 3 ? (
              <Loader2 className="w-5 h-5 text-[#11338a] animate-spin" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
            )}
            <span className="text-sm font-medium">Dissecting dark patterns & kill-switch</span>
          </div>
        </div>
      ) : (
        <>
          {/* Dropzone */}
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
            className={`border-2 border-dashed rounded-2xl p-7 text-center transition-all cursor-pointer ${
              dragActive
                ? "border-[#11338a] bg-blue-50/70 scale-[1.01]"
                : "border-[#d0e1ed] hover:border-[#11338a]/60 bg-white/40 hover:bg-white/60"
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

            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100/70 flex items-center justify-center text-[#11338a]">
              <Upload className="w-6 h-6" />
            </div>

            <p className="font-semibold text-[#0f1e3b] text-base">
              Drag &amp; drop your screenshot
            </p>
            <p className="text-xs text-[#54657a] mt-1">
              or click to browse &middot; PNG, JPG, WEBP up to 10MB
            </p>
          </div>

          {/* Inline Error / Frowning Warning Alert */}
          {error && (
            <div className="mt-4 p-3.5 rounded-xl bg-red-50/90 border border-red-200/80 flex items-start space-x-2.5 text-left text-xs text-[#df202e] animate-in fade-in">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#df202e]" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => document.getElementById("receipt-input")?.click()}
            className="w-full mt-5 py-3 px-5 rounded-xl btn-primary font-semibold text-sm flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Choose screenshot</span>
          </button>

          {/* Sample Preset Pills */}
          <div className="mt-6 pt-5 border-t border-[#d0e1ed]/70">
            <p className="text-xs font-semibold text-[#54657a] text-center mb-2.5 flex items-center justify-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#11338a]" />
              <span>Or try a sample trap:</span>
            </p>

            <div className="flex flex-col space-y-2">
              {PRESET_SCENARIOS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => runPresetAnalysis(preset)}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl bg-white/70 hover:bg-white border border-[#d0e1ed]/80 hover:border-[#11338a]/50 text-xs font-medium text-[#0f1e3b] flex items-center justify-between transition-all hover:shadow-sm group cursor-pointer"
                >
                  <span className="flex items-center space-x-2">
                    <FileText className="w-3.5 h-3.5 text-[#11338a]" />
                    <span>{preset.name}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#e0f1fe] text-[#11338a] font-semibold text-[10px] group-hover:bg-[#11338a] group-hover:text-white transition-colors">
                    {preset.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Security Footer */}
      <div className="mt-6 pt-3 text-center flex items-center justify-center space-x-1.5 text-xs text-[#54657a]">
        <ShieldCheck className="w-4 h-4 text-[#54b66e]" />
        <span>Processed privately on your device</span>
      </div>
    </div>
  );
}
