export interface GraphMetrics {
  total_nodes: number;
  total_edges: number;
  connected_components: number;
  largest_component_size: number;
  avg_degree: number;
  max_degree: number;
  graph_attributes: Record<string, string | number>;
}
