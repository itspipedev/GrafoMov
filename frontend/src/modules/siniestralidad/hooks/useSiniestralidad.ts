import { useQuery } from "@tanstack/react-query";
import { graphApi } from "../../../shared/api/client";

export function useSiniestralidad(limit = 30) {
  return useQuery({ queryKey: ["siniestralidad", limit], queryFn: () => graphApi.getSiniestralidad(limit) });
}
