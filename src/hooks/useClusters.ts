import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

// A API já ordena; buscamos sempre por pedidos e reordenamos no cliente,
// assim trocar a métrica não dispara outra requisição.
export function useClusters() {
  return useQuery({ queryKey: ["clusters"], queryFn: () => api.listClusters("orders") });
}

export function useSummary() {
  return useQuery({ queryKey: ["clusters", "summary"], queryFn: api.getSummary });
}
