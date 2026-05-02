export const ROUTES = {
  HOME: "/",
  MAP: "/map",
  CHAT: "/chat",
  METRICS: "/metrics",
  SINIESTRALIDAD: "/siniestralidad",
  ACCESSIBILITY: "/accessibility",
} as const;

export const MAP_CONFIG = {
  center: [4.65, -74.1] as [number, number],
  zoom: 12,
  tileUrl: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  attribution: "GrafoMov | © CARTO",
};

export const COLORS = {
  estacion_tm: "#ef4444",
  paradero_sitp: "#3b82f6",
  interseccion_vial: "#64748b",
  conexion_troncal: "#eab308",
  danger: "#ef4444",
  warning: "#f59e0b",
  success: "#10b981",
  info: "#3b82f6",
  purple: "#a855f7",
  accent: "#10b981",
} as const;
