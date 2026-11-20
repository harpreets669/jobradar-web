"use client";

import { Job } from "@/lib/types";
import { MapPin, Building2, ExternalLink, Briefcase, Clock } from "lucide-react";

const SOURCE_LABELS: Record<string, string> = {
  adzuna: "Adzuna",
  timesjobs: "TimesJobs",
  remotive: "Remotive",
  internshala: "Internshala",
};

const ROLE_COLORS: Record<string, string> = {
  "Software Engineer": "bg-blue-100 text-blue-800",
  "Data Analyst": "bg-purple-100 text-purple-800",
  "Data Science / ML": "bg-indigo-100 text-indigo-800",
  "Marketing": "bg-pink-100 text-pink-800",
  "Design / UI-UX": "bg-yellow-100 text-yellow-800",
  "Finance / Accounting": "bg-green-100 text-green-800",
  "Human Resources": "bg-orange-100 text-orange-800",
  "Sales": "bg-red-100 text-red-800",
};

function timeAgo(dateStr: string): string {
  // Ensure UTC is assumed if no timezone suffix present
  const normalized = /[Z+\-]\d*$/.test(dateStr) ? dateStr : dateStr + "Z";
  const diff = Date.now() - new Date(normalized).getTime();
  if (diff < 0) return "just now";
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(normalized).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function JobCard({ job }: { job: Job }) {
  const roleColor = ROLE_COLORS[job.role_category] ?? "bg-gray-100 text-gray-700";

  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors"
          >
            {job.title}
          </a>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {job.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {job.is_remote ? "Remote" : job.city || "India"}
            </span>
          </div>

          {job.description && (
            <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
              {job.description}
            </p>
          )}
        </div>

        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleColor}`}>
          {job.role_category || "Other"}
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
          {job.experience_type}
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
          {SOURCE_LABELS[job.source] ?? job.source}
        </span>
        <span className="ml-auto flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          {timeAgo(job.posted_at ?? job.fetched_at)}
        </span>
      </div>
    </div>
  );
}
