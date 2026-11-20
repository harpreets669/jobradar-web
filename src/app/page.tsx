"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Loader2, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { JobCard } from "@/components/JobCard";
import { FilterPanel } from "@/components/FilterPanel";
import { StatsBar } from "@/components/StatsBar";
import { fetchJobs, fetchStats, triggerRefresh } from "@/lib/api";
import { JobListResponse, StatsResponse } from "@/lib/types";

const EMPTY_STATS: StatsResponse = {
  total_jobs: 0,
  sources: {},
  top_cities: {},
  top_roles: {},
  last_refreshed: null,
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filters, setFilters] = useState({ city: "", role: "", source: "", experience: "" });
  const [page, setPage] = useState(1);
  const [data, setData] = useState<JobListResponse | null>(null);
  const [stats, setStats] = useState<StatsResponse>(EMPTY_STATS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchJobs({
        q: debouncedQuery,
        ...filters,
        page,
        page_size: 20,
      });
      setData(result);
    } catch {
      console.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, filters, page]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    fetchStats().then(setStats).catch(console.error);
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setPage(1);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await triggerRefresh();
    setTimeout(async () => {
      await loadJobs();
      const s = await fetchStats();
      setStats(s);
      setRefreshing(false);
    }, 3000);
  };

  const totalPages = data ? Math.ceil(data.total / 20) : 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">JobRadar</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Fresher & internship jobs across India</p>
          </div>
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, companies, skills..."
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats */}
        <div className="mb-6">
          <StatsBar stats={stats} />
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <FilterPanel stats={stats} filters={filters} onChange={handleFilterChange} />
            </div>
          </aside>

          {/* Job list */}
          <div className="flex-1 min-w-0">
            {/* Mobile filters */}
            <div className="lg:hidden mb-4">
              <FilterPanel stats={stats} filters={filters} onChange={handleFilterChange} />
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : data?.jobs.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-lg font-medium">No jobs found</p>
                <p className="text-sm mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  {data?.total.toLocaleString()} result{data?.total !== 1 ? "s" : ""}
                  {debouncedQuery && ` for "${debouncedQuery}"`}
                </p>

                <div className="space-y-3">
                  {data?.jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
