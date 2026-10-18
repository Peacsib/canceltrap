"use client";

import React, { useState } from "react";
import { HeroLanding } from "@/components/HeroLanding";
import { DefusalDashboard } from "@/components/DefusalDashboard";
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
        <DefusalDashboard data={data} onReset={handleReset} />
      )}
    </div>
  );
}
