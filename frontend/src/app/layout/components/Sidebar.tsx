import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../../shared/config";
import { Map, MessageCircle, BarChart3, AlertTriangle, Accessibility } from "lucide-react";

const NAV_ITEMS = [
  { path: ROUTES.MAP, label: "Mapa", icon: Map },
  { path: ROUTES.CHAT, label: "Chat IA", icon: MessageCircle },
  { path: ROUTES.METRICS, label: "Métricas", icon: BarChart3 },
  { path: ROUTES.SINIESTRALIDAD, label: "Peligro", icon: AlertTriangle },
  { path: ROUTES.ACCESSIBILITY, label: "Acceso", icon: Accessibility },
];

const sidebarStyle: React.CSSProperties = {
  position: "fixed",
  left: 0,
  top: 0,
  height: "100vh",
  width: 72,
  background: "linear-gradient(180deg, #0f172a 0%, #1a1a2e 50%, #16213e 100%)",
  borderRight: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "4px 0 24px rgba(0,0,0,0.3)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: 12,
  paddingBottom: 12,
  gap: 2,
  zIndex: 9999,
  overflowY: "auto",
};

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside style={sidebarStyle}>
      <Link to={ROUTES.HOME} style={{ marginBottom: 16 }}>
        <div className="glow" style={{
          width: 40, height: 40, borderRadius: 12,
          background: "linear-gradient(135deg, #10b981, #3b82f6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: 900, fontSize: 14,
        }}>
          GM
        </div>
      </Link>

      {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
        const active = pathname === path;
        return (
          <Link key={path} to={path} title={label} style={{
            width: 52, height: 52, borderRadius: 12,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 2, textDecoration: "none", transition: "all 0.2s",
            background: active ? "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(59,130,246,0.15))" : "transparent",
            borderLeft: active ? "3px solid #10b981" : "3px solid transparent",
            color: active ? "#34d399" : "#64748b",
          }}>
            <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
            <span style={{ fontSize: 9, fontWeight: 500 }}>{label}</span>
          </Link>
        );
      })}

      <div style={{ marginTop: "auto" }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%", background: "#1e293b",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 8, color: "#475569", fontFamily: "monospace",
        }}>v0.1</div>
      </div>
    </aside>
  );
}
