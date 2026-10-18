"use client";

import React, { useState } from "react";
import { HeroLanding } from "@/components/HeroLanding";
import { SubscriptionDefusalResponse } from "@/lib/types";

export default function Home() {
  const [data, setData] = useState<SubscriptionDefusalResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeComplete = (result: SubscriptionDefusalResponse) => {
    setData(result);
  };

  const handleReset = () => {
    setData(null);
    setError(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="relative min-h-screen">
      {!data ? (
        <HeroLanding
          onAnalyzeComplete={handleAnalyzeComplete}
          isAnalyzing={isAnalyzing}
          setIsAnalyzing={setIsAnalyzing}
          error={error}
          setError={setError}
        />
      ) : (
        <div className="p-8 max-w-4xl mx-auto">
          <div className="glass-card p-6 flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">{data.merchant.name}</h2>
              <p className="text-sm text-gray-600">Scan Complete</p>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm"
            >
              New Scan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
