import type { ApiResponse, Cluster, ClustersSummary } from "../types/cluster";

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

  // "no-store": o navegador não reaproveita respostas antigas, sempre pede à API.
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { cache: "no-store" });
  } catch {
    // O navegador só dá "Failed to fetch" quando não consegue ler a resposta:
    // API fora do ar, URL errada ou Lambda quebrando antes de responder (sem headers de CORS).
    throw new ApiError(0, "Não foi possível conectar à API. Confira a VITE_API_URL e os logs da Lambda no CloudWatch.");
  }
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(res.status, json?.error?.message ?? `Erro HTTP ${res.status}`);
  }
  return json as ApiResponse<T>;
}

export const api = {
  listClusters: () => get<Cluster[]>("/clusters").then((r) => r.data),
  getCluster: (geohash: string) =>
    get<Cluster>(`/clusters/${encodeURIComponent(geohash)}`).then((r) => r.data),
  getSummary: () => get<ClustersSummary>("/clusters/summary").then((r) => r.data),
};
