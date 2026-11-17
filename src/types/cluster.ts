/** Mesmo formato retornado pela API (api-geohash). */
export interface Cluster {
  geohash: string;
  /** Centroide (sum_lat / count) */
  latitude: number;
  /** Centroide (sum_lng / count) */
  longitude: number;
  /** Quantidade de pedidos no cluster */
  count: number;
  updatedAt?: string;
}

export interface ClustersSummary {
  totalClusters: number;
  totalOrders: number;
  averageOrdersPerCluster: number;
  largestCluster: { geohash: string; count: number } | null;
  lastUpdatedAt: string | null;
}

export interface ApiResponse<T> {
  data: T;
  meta: { count?: number; generatedAt: string };
}
