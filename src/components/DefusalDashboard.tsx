"use client";

import React from "react";
import { SubscriptionDefusalResponse } from "@/lib/types";
import { SubscriptionRescue } from "./SubscriptionRescue";

interface DefusalDashboardProps {
  data: SubscriptionDefusalResponse;
  onReset: () => void;
}

export function DefusalDashboard({ data, onReset }: DefusalDashboardProps) {
  return <SubscriptionRescue data={data} onReset={onReset} />;
}
