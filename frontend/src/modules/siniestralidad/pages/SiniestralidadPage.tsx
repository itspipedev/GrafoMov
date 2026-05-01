import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { graphApi } from "../../../shared/api/client";
import { BOGOTA_CENTER } from "../../../shared/config";
import { Loading } from "../../../shared/ui";
import { AlertTriangle } from "lucide-react";

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

export default function SiniestralidadPage() {
  const { data, isLoading } = useQuery({ queryKey: ["siniestralidad"], queryFn: () => graphApi.getSiniestralidad(30) });

  return (
    <div style={{ height: "100vh", position: "relative" }}>
      <div style={headerStyle}>
        <AlertTriangle size={18} color="#f87171" />
        <span style={{ fontSize: 14, fontWeight: 700 }}>Zonas con mayor siniestralidad</span>
      </div>

      {data && data.length > 0 && (
        <div style={panelStyle}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🚨 Top {data.length} zonas peligrosas</h3>
          {data.map((n: any, i: number) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600 }}>{n.name}</p>
                <p style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                  Score: {Number(n.properties?.siniestralidad_score || 0).toFixed(2)} | Grado: {n.properties?.grado}
                </p>
              </div>
              <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "rgba(239,68,68,0.15)", color: "#f87171", fontWeight: 600, whiteSpace: "nowrap" }}>
                {n.properties?.fallecidos_cercanos} 💀
              </span>
            </div>
          ))}
        </div>
      )}

      {isLoading && <div style={{ position: "absolute", inset: 0, zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}><Loading /></div>}

      <MapContainer center={BOGOTA_CENTER} zoom={12} style={{ height: "100%", width: "100%" }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="GrafoMov" />
        {data?.map((n: any, i: number) => {
          const score = Number(n.properties?.siniestralidad_score || 0);
          return (
            <CircleMarker key={i} center={[n.coordinates.lat, n.coordinates.lon]}
              radius={Math.max(8, score * 5)} color="#ef4444" fillColor="#ef4444" fillOpacity={0.35} weight={2}>
              <Popup><b>{n.name}</b><br/>⚠️ Score: {score.toFixed(2)}<br/>💀 Fallecidos: {n.properties?.fallecidos_cercanos}</Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
