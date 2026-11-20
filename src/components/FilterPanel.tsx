"use client";

import { StatsResponse } from "@/lib/types";

const ROLE_OPTIONS = [
  "Software Engineer",
  "Data Analyst",
  "Data Science / ML",
  "Product Management",
  "Marketing",
  "Sales",
  "Design / UI-UX",
  "Finance / Accounting",
  "Human Resources",
  "Operations",
  "Content Writing",
  "Customer Support",
  "Business Development",
  "Research",
  "Other",
];

interface Props {
  stats: StatsResponse;
  filters: {
    city: string;
    role: string;
    source: string;
    experience: string;
  };
  onChange: (key: string, value: string) => void;
}

export function FilterPanel({ stats, filters, onChange }: Props) {
  const topCities = Object.keys(stats.top_cities).slice(0, 8);
  const sources = Object.keys(stats.sources);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5">
      <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Filters</h3>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">Role</label>
        <select
          value={filters.role}
          onChange={(e) => onChange("role", e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All roles</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">City</label>
        <select
          value={filters.city}
          onChange={(e) => onChange("city", e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All cities</option>
          {topCities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
          <option value="Remote">Remote</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">Type</label>
        <div className="flex gap-2 flex-wrap">
          {["", "fresher", "intern"].map((exp) => (
            <button
              key={exp}
              onClick={() => onChange("experience", exp)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                filters.experience === exp
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 text-gray-600 hover:border-blue-300"
              }`}
            >
              {exp === "" ? "All" : exp.charAt(0).toUpperCase() + exp.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">Source</label>
        <div className="flex gap-2 flex-wrap">
          {["", ...sources].map((src) => (
            <button
              key={src}
              onClick={() => onChange("source", src)}
              className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-colors ${
                filters.source === src
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 text-gray-600 hover:border-blue-300"
              }`}
            >
              {src === "" ? "All" : src}
            </button>
          ))}
        </div>
      </div>

      {(filters.city || filters.role || filters.source || filters.experience) && (
        <button
          onClick={() => {
            onChange("city", "");
            onChange("role", "");
            onChange("source", "");
            onChange("experience", "");
          }}
          className="text-xs text-blue-600 hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
