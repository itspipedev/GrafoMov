import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { graphApi } from "../../../shared/api/client";
import { BOGOTA_CENTER } from "../../../shared/config";
import { Loading } from "../../../shared/ui";
import { AlertTriangle } from "lucide-react";
import "leaflet/dist/leaflet.css";

export default function SiniestralidadPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["siniestralidad"],
    queryFn: () => graphApi.getSiniestralidad(30),
  });

  return (
    <div className="h-screen relative">
      <div className="absolute top-4 left-4 z-[1000] bg-zinc-900/95 backdrop-blur rounded-xl px-4 py-3 border border-zinc-800 flex items-center gap-2">
        <AlertTriangle size={18} className="text-red-400" />
        <span className="text-sm font-medium">Zonas con mayor siniestralidad</span>
      </div>

      {/* Panel derecho */}
      {data && data.length > 0 && (
        <div className="absolute top-4 right-4 z-[1000] bg-zinc-900/95 backdrop-blur rounded-xl p-4 w-80 max-h-[80vh] overflow-y-auto border border-zinc-800">
          <h3 className="text-sm font-bold mb-3">🚨 Top {data.length} zonas peligrosas</h3>
          {data.map((n: any, i: number) => (
            <div key={i} className="py-2 border-b border-zinc-800 last:border-0">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium">{n.name}</p>
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full shrink-0 ml-2">
                  {n.properties?.fallecidos_cercanos} 💀
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Score: {Number(n.properties?.siniestralidad_score || 0).toFixed(2)} | Grado: {n.properties?.grado}
              </p>
            </div>
          ))}
        </div>
      )}

      {isLoading && <div className="absolute inset-0 z-[999] flex items-center justify-center"><Loading /></div>}

      <MapContainer center={BOGOTA_CENTER} zoom={12} className="h-full w-full" zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="GrafoMov" />
        {data?.map((n: any, i: number) => {
          const score = Number(n.properties?.siniestralidad_score || 0);
          const radius = Math.max(8, Math.min(20, score * 6));
          return (
            <CircleMarker key={i} center={[n.coordinates.lat, n.coordinates.lon]}
              radius={radius} color="#ef4444" fillColor="#ef4444" fillOpacity={0.4} weight={2}>
              <Popup>
                <b>{n.name}</b><br />
                ⚠️ Score: {score.toFixed(2)}<br />
                💀 Fallecidos: {n.properties?.fallecidos_cercanos}<br />
                📊 Grado: {n.properties?.grado}
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
