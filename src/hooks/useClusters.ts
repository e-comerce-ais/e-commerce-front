import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

// Busca os dados de novo a cada 2s para o mapa ir mostrando os clusters
// conforme a Lambda consumidora grava no DynamoDB.
const REFRESH_MS = 2000;

export function useClusters() {
  return useQuery({
    queryKey: ["clusters"],
    queryFn: api.listClusters,
    refetchInterval: REFRESH_MS,
    staleTime: 0,
  });
}

export function useSummary() {
  return useQuery({
    queryKey: ["clusters", "summary"],
    queryFn: api.getSummary,
    refetchInterval: REFRESH_MS,
    staleTime: 0,
  });
}
