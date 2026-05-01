import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({ baseURL: API_BASE });

// Graph endpoints
export const graphApi = {
  getMetrics: () => api.get("/graph/metrics").then((r) => r.data),
  getNodes: (type?: string, limit = 100) =>
    api.get("/graph/nodes", { params: { node_type: type, limit } }).then((r) => r.data),
  getNearby: (lat: number, lon: number, radius = 0.5, limit = 10) =>
    api.get("/graph/nearby", { params: { lat, lon, radius_km: radius, limit } }).then((r) => r.data),
  getPath: (origin: string, destination: string) =>
    api.get("/graph/path", { params: { origin, destination } }).then((r) => r.data),
  getTop: (metric: string, limit = 10) =>
    api.get(`/graph/top/${metric}`, { params: { limit } }).then((r) => r.data),
  getSiniestralidad: (limit = 20) =>
    api.get("/graph/siniestralidad/top", { params: { limit } }).then((r) => r.data),
  getWorstAccessibility: (limit = 20) =>
    api.get("/graph/accessibility/worst", { params: { limit } }).then((r) => r.data),
};

// Agent endpoints
export const agentApi = {
  chat: (message: string, sessionId = "default") =>
    api.post("/agent/chat", { message, session_id: sessionId }).then((r) => r.data),
  reset: (sessionId = "default") =>
    api.post("/agent/reset", null, { params: { session_id: sessionId } }).then((r) => r.data),
};
