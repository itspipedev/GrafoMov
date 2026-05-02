import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { graphApi } from "../../../shared/api/client";
import type { NearbyResult } from "../../../shared/types";

export function useStations(enabled = true) {
  return useQuery({ queryKey: ["nodes", "estacion_tm"], queryFn: () => graphApi.getNodes("estacion_tm", 200), enabled });
}

export function useParaderos(enabled = false) {
  return useQuery({ queryKey: ["nodes", "paradero_sitp"], queryFn: () => graphApi.getNodes("paradero_sitp", 500), enabled });
}

export function useNearbySearch() {
  const [nearby, setNearby] = useState<NearbyResult[]>([]);
  const [clickPos, setClickPos] = useState<[number, number] | null>(null);

  const search = async (lat: number, lon: number) => {
    setClickPos([lat, lon]);
    try {
      setNearby(await graphApi.getNearby(lat, lon, 0.5, 10));
    } catch {
      setNearby([]);
    }
  };

  const clear = () => { setNearby([]); setClickPos(null); };

  return { nearby, clickPos, search, clear };
}
