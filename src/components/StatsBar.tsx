"use client";

import { StatsResponse } from "@/lib/types";
import { Briefcase, RefreshCw } from "lucide-react";

export function StatsBar({ stats }: { stats: StatsResponse }) {
  const lastRefreshed = stats.last_refreshed
    ? new Date(stats.last_refreshed).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Never";

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
      <span className="flex items-center gap-1.5 font-medium text-gray-900">
        <Briefcase className="w-4 h-4 text-blue-500" />
        {stats.total_jobs.toLocaleString()} jobs tracked
      </span>
      <span className="text-gray-300">|</span>
      {Object.entries(stats.sources).map(([src, count]) => (
        <span key={src} className="capitalize">
          {src}: <strong className="text-gray-700">{count}</strong>
        </span>
      ))}
      <span className="ml-auto flex items-center gap-1 text-xs text-gray-400">
        <RefreshCw className="w-3 h-3" />
        Last updated {lastRefreshed}
      </span>
    </div>
  );
}
