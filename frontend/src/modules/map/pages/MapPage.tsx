import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents } from "react-leaflet";
import { graphApi } from "../../../shared/api/client";
import { BOGOTA_CENTER, DEFAULT_ZOOM } from "../../../shared/config";
import { Loading } from "../../../shared/ui";
import "leaflet/dist/leaflet.css";

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

  const { data: estaciones, isLoading: loadingTM } = useQuery({
    queryKey: ["nodes", "estacion_tm"],
    queryFn: () => graphApi.getNodes("estacion_tm", 200),
    enabled: showTM,
  });

  const { data: paraderos, isLoading: loadingSITP } = useQuery({
    queryKey: ["nodes", "paradero_sitp"],
    queryFn: () => graphApi.getNodes("paradero_sitp", 300),
    enabled: showSITP,
  });

  const handleMapClick = async (lat: number, lon: number) => {
    setClickPos([lat, lon]);
    const data = await graphApi.getNearby(lat, lon, 0.5, 10);
    setNearby(data);
  };

  return (
    <div className="h-screen relative">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-[1000] flex gap-2">
        <button onClick={() => setShowTM(!showTM)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${showTM ? "bg-red-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}>
          🔴 Transmilenio
        </button>
        <button onClick={() => setShowSITP(!showSITP)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${showSITP ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}>
          🔵 SITP
        </button>
      </div>

      {/* Nearby panel */}
      {nearby.length > 0 && (
        <div className="absolute top-4 right-4 z-[1000] bg-zinc-900/95 backdrop-blur rounded-xl p-4 w-80 max-h-96 overflow-y-auto border border-zinc-800">
          <h3 className="text-sm font-bold mb-2">📍 Paraderos cercanos</h3>
          {nearby.map((item: any, i: number) => (
            <div key={i} className="flex justify-between items-center py-1.5 border-b border-zinc-800 last:border-0">
              <div>
                <p className="text-sm font-medium">{item.node.name}</p>
                <p className="text-xs text-zinc-400">{item.node.properties?.direccion}</p>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">{item.distance_km} km</span>
            </div>
          ))}
        </div>
      )}

      {(loadingTM || loadingSITP) && <div className="absolute inset-0 z-[999] flex items-center justify-center"><Loading /></div>}

      <MapContainer center={BOGOTA_CENTER} zoom={DEFAULT_ZOOM} className="h-full w-full" zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="GrafoMov" />
        <ClickHandler onMapClick={handleMapClick} />

        {showTM && estaciones?.map((n: any) => (
          <CircleMarker key={n.id} center={[n.coordinates.lat, n.coordinates.lon]}
            radius={8} color={COLORS.estacion_tm} fillOpacity={0.9}>
            <Popup><b>{n.name}</b><br />{n.properties?.troncal}<br />Grado: {n.properties?.grado}</Popup>
          </CircleMarker>
        ))}

        {showSITP && paraderos?.map((n: any) => (
          <CircleMarker key={n.id} center={[n.coordinates.lat, n.coordinates.lon]}
            radius={3} color={COLORS.paradero_sitp} fillOpacity={0.7}>
            <Popup><b>{n.name}</b><br />{n.properties?.direccion}</Popup>
          </CircleMarker>
        ))}

        {clickPos && <CircleMarker center={clickPos} radius={12} color="#10b981" fillOpacity={0.3} />}

        {nearby.map((item: any, i: number) => (
          <CircleMarker key={`nearby-${i}`} center={[item.node.coordinates.lat, item.node.coordinates.lon]}
            radius={6} color="#10b981" fillOpacity={0.8}>
            <Popup><b>{item.node.name}</b><br />{item.distance_km} km</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
