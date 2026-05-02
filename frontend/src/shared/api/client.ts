import axios from "axios";
import type { GraphNode, GraphMetrics, NearbyResult, PathResult, ChatResponse } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
});

// Graph API — Interface Segregation: cada función hace una sola cosa
export const graphApi = {
  getMetrics: () => api.get<GraphMetrics>("/graph/metrics").then((r) => r.data),

  getNodes: (type?: string, limit = 100) =>
    api.get<GraphNode[]>("/graph/nodes", { params: { node_type: type, limit } }).then((r) => r.data),

  getNode: (id: string) =>
    api.get<GraphNode>(`/graph/nodes/${encodeURIComponent(id)}`).then((r) => r.data),

  getNearby: (lat: number, lon: number, radiusKm = 0.5, limit = 10) =>
    api.get<NearbyResult[]>("/graph/nearby", { params: { lat, lon, radius_km: radiusKm, limit } }).then((r) => r.data),

  getPath: (origin: string, destination: string) =>
    api.get<PathResult>("/graph/path", { params: { origin, destination } }).then((r) => r.data),

  getTop: (metric: string, limit = 10) =>
    api.get<GraphNode[]>(`/graph/top/${metric}`, { params: { limit } }).then((r) => r.data),

  getSiniestralidad: (limit = 20) =>
    api.get<GraphNode[]>("/graph/siniestralidad/top", { params: { limit } }).then((r) => r.data),

  getWorstAccessibility: (limit = 20) =>
    api.get<GraphNode[]>("/graph/accessibility/worst", { params: { limit } }).then((r) => r.data),
};

// Agent API
export const agentApi = {
  chat: (message: string, sessionId = "default") =>
    api.post<ChatResponse>("/agent/chat", { message, session_id: sessionId }).then((r) => r.data),

  reset: (sessionId = "default") =>
    api.post("/agent/reset", null, { params: { session_id: sessionId } }),
};
