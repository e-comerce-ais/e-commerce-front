/** Mesmo formato retornado pela API (api-geohash). */
export interface Cluster {
  geohash: string;
  latitude: number;
  longitude: number;
  totalOrders: number;
  totalValue: number;
  updatedAt?: string;
}

export interface ClustersSummary {
  totalClusters: number;
  totalOrders: number;
  totalValue: number;
  averageOrdersPerCluster: number;
  averageTicket: number;
}

export interface ApiResponse<T> {
  data: T;
  meta: { count?: number; generatedAt: string };
}

export type Metric = "orders" | "value";
