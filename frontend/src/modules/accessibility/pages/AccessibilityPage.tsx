import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { graphApi } from "../../../shared/api/client";
import { BOGOTA_CENTER } from "../../../shared/config";
import { Loading } from "../../../shared/ui";
import { Accessibility } from "lucide-react";

const panelStyle: React.CSSProperties = {
  position: "absolute", top: 16, right: 16, zIndex: 1000, width: 340, maxHeight: "85vh",
  overflowY: "auto", padding: 20, borderRadius: 16,
  background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))",
  backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
};

const headerStyle: React.CSSProperties = {
  position: "absolute", top: 16, left: 16, zIndex: 1000, padding: "12px 20px", borderRadius: 14,
  background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))",
  backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.08)",
  display: "flex", alignItems: "center", gap: 10,
};

const legendStyle: React.CSSProperties = {
  position: "absolute", bottom: 24, left: 16, zIndex: 1000, padding: "10px 16px", borderRadius: 12,
  background: "rgba(15,23,42,0.95)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.08)",
  display: "flex", gap: 16, fontSize: 12,
};

const dot = (color: string): React.CSSProperties => ({ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block", marginRight: 6 });

export default function AccessibilityPage() {
  const [tab, setTab] = useState<"worst" | "best">("worst");

  const { data: worst, isLoading: l1 } = useQuery({ queryKey: ["acc-worst"], queryFn: () => graphApi.getWorstAccessibility(30) });
  const { data: best, isLoading: l2 } = useQuery({ queryKey: ["acc-best"], queryFn: () => graphApi.getTop("betweenness", 15) });

  return (
    <div style={{ height: "100vh", position: "relative" }}>
      <div style={headerStyle}>
        <Accessibility size={18} color="#c084fc" />
        <span style={{ fontSize: 14, fontWeight: 700 }}>Accesibilidad del transporte</span>
      </div>

      <div style={legendStyle}>
        <span><span style={dot("#a855f7")} />Peor conectados</span>
        <span><span style={dot("#10b981")} />Más centrales</span>
      </div>

      {(worst || best) && (
        <div style={panelStyle}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {(["worst", "best"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: "8px 0", borderRadius: 10, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
                background: tab === t ? (t === "worst" ? "rgba(168,85,247,0.2)" : "rgba(16,185,129,0.2)") : "rgba(30,41,59,0.5)",
                color: tab === t ? (t === "worst" ? "#c084fc" : "#34d399") : "#64748b",
              }}>
                {t === "worst" ? "🟣 Peor conectados" : "🟢 Más centrales"}
              </button>
            ))}
          </div>

          {tab === "worst" && worst?.map((n: any, i: number) => (
            <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize: 13, fontWeight: 600 }}>{n.name}</p>
              <p style={{ fontSize: 11, color: "#64748b" }}>Closeness: {Number(n.properties?.closeness || 0).toFixed(4)}</p>
            </div>
          ))}

          {tab === "best" && best?.map((n: any, i: number) => (
            <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize: 13, fontWeight: 600 }}>{n.name}</p>
              <p style={{ fontSize: 11, color: "#64748b" }}>Betweenness: {Number(n.properties?.betweenness || 0).toFixed(4)}</p>
            </div>
          ))}
        </div>
      )}

      {(l1 || l2) && <div style={{ position: "absolute", inset: 0, zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}><Loading /></div>}

      <MapContainer center={BOGOTA_CENTER} zoom={12} style={{ height: "100%", width: "100%" }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="GrafoMov" />

        {worst?.map((n: any, i: number) => (
          <CircleMarker key={`w-${i}`} center={[n.coordinates.lat, n.coordinates.lon]}
            radius={8} color="#a855f7" fillColor="#a855f7" fillOpacity={0.45} weight={2}>
            <Popup><b>{n.name}</b><br/>Closeness: {Number(n.properties?.closeness || 0).toFixed(4)}<br/>⚠️ Zona mal conectada</Popup>
          </CircleMarker>
        ))}

        {best?.map((n: any, i: number) => (
          <CircleMarker key={`b-${i}`} center={[n.coordinates.lat, n.coordinates.lon]}
            radius={12} color="#10b981" fillColor="#10b981" fillOpacity={0.45} weight={2}>
            <Popup><b>{n.name}</b><br/>Betweenness: {Number(n.properties?.betweenness || 0).toFixed(4)}<br/>✅ Nodo central</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
