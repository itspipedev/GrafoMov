import { useQuery } from "@tanstack/react-query";
import { graphApi } from "../../../shared/api/client";

export function useAccessibility(limit = 30) {
  return useQuery({ queryKey: ["acc-worst", limit], queryFn: () => graphApi.getWorstAccessibility(limit) });
}

export function useCentrality(limit = 15) {
  return useQuery({ queryKey: ["acc-best", limit], queryFn: () => graphApi.getTop("betweenness", limit) });
}
