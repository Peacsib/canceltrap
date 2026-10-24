"use client";

import React, { Suspense } from "react";
import { DefusalDashboard } from "@/components/DefusalDashboard";
import { useRouter } from "next/navigation";

function SavedContent() {
  const router = useRouter();
  return <DefusalDashboard initialTab="saved" onReset={() => router.push("/")} />;
}

export default function SavedRoutesPage() {
  return (
    <div className="relative min-h-screen">
      <Suspense
        fallback={
          <div className="min-h-screen w-full bg-[#f8fbfe] flex items-center justify-center text-sm font-medium text-slate-400">
            Loading Saved Routes...
          </div>
        }
      >
        <SavedContent />
      </Suspense>
    </div>
  );
}
