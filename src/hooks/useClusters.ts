import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export function useClusters() {
  return useQuery({ queryKey: ["clusters"], queryFn: api.listClusters });
}

export function useSummary() {
  return useQuery({ queryKey: ["clusters", "summary"], queryFn: api.getSummary });
}
