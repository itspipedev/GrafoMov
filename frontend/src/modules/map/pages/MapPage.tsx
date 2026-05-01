import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents } from "react-leaflet";
import { graphApi } from "../../../shared/api/client";
import { BOGOTA_CENTER, DEFAULT_ZOOM } from "../../../shared/config";

const COLORS: Record<string, string> = {
  estacion_tm: "#ef4444",
  paradero_sitp: "#3b82f6",
};

function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lon: number) => void }) {
  useMapEvents({ click: (e) => onMapClick(e.latlng.lat, e.latlng.lng) });
  return null;
}

export default function MapPage() {
  const [showTM, setShowTM] = useState(true);
  const [showSITP, setShowSITP] = useState(false);
  const [nearby, setNearby] = useState<any[]>([]);
  const [clickPos, setClickPos] = useState<[number, number] | null>(null);

  const { data: estaciones } = useQuery({
    queryKey: ["nodes", "estacion_tm"],
    queryFn: () => graphApi.getNodes("estacion_tm", 200),
    enabled: showTM,
    retry: false,
  });

  const { data: paraderos } = useQuery({
    queryKey: ["nodes", "paradero_sitp"],
    queryFn: () => graphApi.getNodes("paradero_sitp", 300),
    enabled: showSITP,
    retry: false,
  });

  const handleMapClick = async (lat: number, lon: number) => {
    setClickPos([lat, lon]);
    try {
      const data = await graphApi.getNearby(lat, lon, 0.5, 10);
      setNearby(data);
    } catch {
      setNearby([]);
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      {/* Controls */}
      <div style={{ position: "absolute", top: 16, left: 16, zIndex: 1000, display: "flex", gap: 8 }}>
        <button onClick={() => setShowTM(!showTM)}
          className={`btn-toggle ${showTM ? "active" : ""}`}
          style={{ background: showTM ? "rgba(239,68,68,0.9)" : "rgba(30,41,59,0.9)", color: "white" }}>
          🔴 Transmilenio
        </button>
        <button onClick={() => setShowSITP(!showSITP)}
          className={`btn-toggle ${showSITP ? "active" : ""}`}
          style={{ background: showSITP ? "rgba(59,130,246,0.9)" : "rgba(30,41,59,0.9)", color: "white" }}>
          🔵 SITP
        </button>
      </div>

      {/* Nearby panel */}
      {nearby.length > 0 && (
        <div className="map-panel animate-fadeIn" style={{ position: "absolute", top: 16, right: 16, zIndex: 1000, padding: 16, width: 320, maxHeight: "80vh", overflowY: "auto" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📍 {nearby.length} paraderos cercanos</h3>
          {nearby.map((item: any, i: number) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600 }}>{item.node.name}</p>
                <p style={{ fontSize: 11, color: "#94a3b8" }}>{item.node.properties?.direccion}</p>
              </div>
              <span className="badge badge-success">{item.distance_km} km</span>
            </div>
          ))}
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={BOGOTA_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com">CARTO</a>'
        />
        <ClickHandler onMapClick={handleMapClick} />

        {showTM && estaciones?.map((n: any) => (
          <CircleMarker key={n.id} center={[n.coordinates.lat, n.coordinates.lon]}
            radius={8} color={COLORS.estacion_tm} fillOpacity={0.9} weight={2}>
            <Popup><b>{n.name}</b><br/>{n.properties?.troncal}<br/>Grado: {n.properties?.grado}</Popup>
          </CircleMarker>
        ))}

        {showSITP && paraderos?.map((n: any) => (
          <CircleMarker key={n.id} center={[n.coordinates.lat, n.coordinates.lon]}
            radius={3} color={COLORS.paradero_sitp} fillOpacity={0.7} weight={1}>
            <Popup><b>{n.name}</b><br/>{n.properties?.direccion}</Popup>
          </CircleMarker>
        ))}

        {clickPos && <CircleMarker center={clickPos} radius={14} color="#10b981" fillOpacity={0.2} weight={2} />}

        {nearby.map((item: any, i: number) => (
          <CircleMarker key={`n-${i}`} center={[item.node.coordinates.lat, item.node.coordinates.lon]}
            radius={7} color="#10b981" fillOpacity={0.8} weight={2}>
            <Popup><b>{item.node.name}</b><br/>{item.distance_km} km</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
