import { useQuery } from "@tanstack/react-query";
import { graphApi } from "../../../shared/api/client";

export function useMetrics() {
  return useQuery({ queryKey: ["metrics"], queryFn: graphApi.getMetrics });
}
