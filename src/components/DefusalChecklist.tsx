"use client";

import React, { useState } from "react";
import { Check, AlertTriangle, ShieldCheck, ListOrdered } from "lucide-react";
import { SubscriptionDefusalResponse } from "@/lib/types";

interface DefusalChecklistProps {
  data: SubscriptionDefusalResponse;
}

export function DefusalChecklist({ data }: DefusalChecklistProps) {
  const { darkPattern, defusalChecklist } = data;
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const totalSteps = defusalChecklist.length;
  const doneCount = Object.values(completedSteps).filter(Boolean).length;
  const allCompleted = totalSteps > 0 && doneCount === totalSteps;

  return (
    <div className="glass-card p-6 w-full text-left">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#d0e1ed]/70">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#e0f1fe] text-[#11338a] flex items-center justify-center">
            <ListOrdered className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0f1e3b] font-display">
              Dark-Pattern Defusal Checklist
            </h3>
            <p className="text-xs text-[#54657a]">
              Follow these verified steps to navigate the merchant&apos;s cancellation maze.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/80 border border-[#d0e1ed] text-[#11338a]">
            {doneCount} of {totalSteps} Defused
          </span>
        </div>
      </div>

      {/* Dark Pattern Exposure Summary Box */}
      <div className="mb-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
        <div className="flex items-start space-x-2.5">
          <AlertTriangle className="w-4 h-4 text-[#eab532] mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-[#0f1e3b] uppercase tracking-wide">
              {darkPattern.patternType}
            </h4>
            <p className="text-xs text-[#54657a] mt-1 leading-relaxed">
              {darkPattern.summary}
            </p>
            {darkPattern.tricksExposed.length > 0 && (
              <ul className="mt-2.5 space-y-1 text-xs text-[#0f1e3b]">
                {darkPattern.tricksExposed.map((trick, idx) => (
                  <li key={idx} className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#eab532]" />
                    <span>{trick}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3.5">
        {defusalChecklist.map((step) => {
          const isDone = !!completedSteps[step.stepNumber];
          return (
            <div
              key={step.stepNumber}
              onClick={() => toggleStep(step.stepNumber)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isDone
                  ? "bg-emerald-50/80 border-emerald-200 shadow-sm"
                  : "bg-white/60 hover:bg-white border-[#d0e1ed]/80 hover:border-[#11338a]/40"
              }`}
            >
              <div className="flex items-start space-x-3.5">
                {/* Checkbox circle */}
                <div
                  className={`w-6 h-6 rounded-lg mt-0.5 flex items-center justify-center transition-all shrink-0 ${
                    isDone
                      ? "bg-[#54b66e] text-white"
                      : "border-2 border-slate-300 bg-white"
                  }`}
                >
                  {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                </div>

                {/* Step content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#11338a] uppercase tracking-wider">
                      Step {step.stepNumber}
                    </span>
                  </div>

                  <p
                    className={`text-sm mt-1 font-medium ${
                      isDone ? "line-through text-[#54657a]" : "text-[#0f1e3b]"
                    }`}
                  >
                    {step.instruction}
                  </p>

                  {/* Decoy Warning */}
                  {step.decoyWarning && (
                    <div className="mt-2.5 p-2 rounded-lg bg-red-50/80 border border-red-200/60 flex items-center space-x-2 text-xs text-[#df202e]">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-medium">
                        <strong>Trap to avoid:</strong> {step.decoyWarning}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* All completed banner */}
      {allCompleted && (
        <div className="mt-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-3 text-emerald-800 animate-in fade-in">
          <ShieldCheck className="w-5 h-5 text-[#54b66e]" />
          <span className="text-sm font-semibold">
            All defusal steps completed! Your subscription is successfully stopped.
          </span>
        </div>
      )}
    </div>
  );
}
