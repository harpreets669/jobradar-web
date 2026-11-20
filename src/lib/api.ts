import { JobListResponse, StatsResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface JobFilters {
  q?: string;
  city?: string;
  role?: string;
  source?: string;
  experience?: string;
  page?: number;
  page_size?: number;
}

export async function fetchJobs(filters: JobFilters = {}): Promise<JobListResponse> {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.city) params.set("city", filters.city);
  if (filters.role) params.set("role", filters.role);
  if (filters.source) params.set("source", filters.source);
  if (filters.experience) params.set("experience", filters.experience);
  params.set("page", String(filters.page ?? 1));
  params.set("page_size", String(filters.page_size ?? 20));

  const res = await fetch(`${API_BASE}/api/jobs?${params}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

export async function fetchStats(): Promise<StatsResponse> {
  const res = await fetch(`${API_BASE}/api/stats`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function triggerRefresh(): Promise<void> {
  await fetch(`${API_BASE}/api/refresh`, { method: "POST" });
}
