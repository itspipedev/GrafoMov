import type { GraphNode } from "./graph-node";

export interface NearbyResult {
  node: GraphNode;
  distance_km: number;
}
