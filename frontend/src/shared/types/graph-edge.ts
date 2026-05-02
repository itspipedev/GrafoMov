export interface GraphEdge {
  source_id: string;
  target_id: string;
  edge_type: string;
  properties: Record<string, unknown>;
}
