"use client";

import React, { useState } from "react";
import { HeroLanding } from "@/components/HeroLanding";
import { DefusalDashboard } from "@/components/DefusalDashboard";
import { SubscriptionDefusalResponse } from "@/lib/types";
import type { DestinationNode } from "@/lib/engine/types";

export default function Home() {
  const [data, setData] = useState<SubscriptionDefusalResponse | null>(null);
  const [destination, setDestination] = useState<DestinationNode | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDashboardView, setIsDashboardView] = useState(false);

  const handleAnalyzeComplete = (result: SubscriptionDefusalResponse) => {
    setData(result);
    setDestination(null);
    setIsDashboardView(true);
  };

  const handleReset = () => {
    setData(null);
    setDestination(null);
    setError(null);
    setIsAnalyzing(false);
    setIsDashboardView(false);
  };

  const showDashboard = isDashboardView || !!data || !!destination;

  return (
    <div className="relative min-h-screen">
      {!showDashboard ? (
        <HeroLanding
          onAnalyzeComplete={handleAnalyzeComplete}
          isAnalyzing={isAnalyzing}
          setIsAnalyzing={setIsAnalyzing}
          error={error}
          setError={setError}
        />
      ) : (
        <DefusalDashboard data={data} destination={destination} onReset={handleReset} />
      )}
    </div>
  );
}

