"use client";

import React, { Suspense } from "react";
import { DefusalDashboard } from "@/components/DefusalDashboard";
import { useRouter } from "next/navigation";

function HistoryContent() {
  const router = useRouter();
  return <DefusalDashboard initialTab="history" onReset={() => router.push("/")} />;
}

export default function DashboardHistoryPage() {
  return (
    <div className="relative min-h-screen">
      <Suspense
        fallback={
          <div className="min-h-screen w-full bg-[#f8fbfe] flex items-center justify-center text-sm font-medium text-slate-400">
            Loading Defusal History...
          </div>
        }
      >
        <HistoryContent />
      </Suspense>
    </div>
  );
}
