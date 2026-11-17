import type { ApiResponse, Cluster, ClustersSummary, Metric } from "../types/cluster";

const BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

async function get<T>(path: string): Promise<ApiResponse<T>> {
  if (!BASE_URL) throw new ApiError(0, "VITE_API_URL não configurada (veja .env.example)");

  const res = await fetch(`${BASE_URL}${path}`);
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(res.status, json?.error?.message ?? `Erro HTTP ${res.status}`);
  }
  return json as ApiResponse<T>;
}

export const api = {
  listClusters: (sort: Metric = "orders") =>
    get<Cluster[]>(`/clusters?sort=${sort}`).then((r) => r.data),
  getCluster: (geohash: string) =>
    get<Cluster>(`/clusters/${encodeURIComponent(geohash)}`).then((r) => r.data),
  getSummary: () => get<ClustersSummary>("/clusters/summary").then((r) => r.data),
};
