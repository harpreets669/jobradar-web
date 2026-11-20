export interface Job {
  id: string;
  title: string;
  company: string;
  city: string;
  role_category: string;
  description: string;
  url: string;
  source: string;
  is_remote: boolean;
  experience_type: string;
  posted_at: string | null;
  fetched_at: string;
}

export interface JobListResponse {
  total: number;
  page: number;
  page_size: number;
  jobs: Job[];
}

export interface StatsResponse {
  total_jobs: number;
  sources: Record<string, number>;
  top_cities: Record<string, number>;
  top_roles: Record<string, number>;
  last_refreshed: string | null;
}
