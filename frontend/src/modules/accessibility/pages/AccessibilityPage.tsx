import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { graphApi } from "../../../shared/api/client";
import { BOGOTA_CENTER } from "../../../shared/config";
import { Loading } from "../../../shared/ui";
import { Accessibility } from "lucide-react";
import "leaflet/dist/leaflet.css";

export default function AccessibilityPage() {
  const { data: worst, isLoading: loadingWorst } = useQuery({
    queryKey: ["accessibility-worst"],
    queryFn: () => graphApi.getWorstAccessibility(30),
  });

  const { data: best, isLoading: loadingBest } = useQuery({
    queryKey: ["centrality-best"],
    queryFn: () => graphApi.getTop("betweenness", 15),
  });

  const loading = loadingWorst || loadingBest;

  return (
    <div className="h-screen relative">
      <div className="absolute top-4 left-4 z-[1000] bg-zinc-900/95 backdrop-blur rounded-xl px-4 py-3 border border-zinc-800 flex items-center gap-2">
        <Accessibility size={18} className="text-purple-400" />
        <span className="text-sm font-medium">Accesibilidad del transporte</span>
      </div>

      {/* Leyenda */}
      <div className="absolute bottom-8 left-4 z-[1000] bg-zinc-900/95 backdrop-blur rounded-xl px-4 py-3 border border-zinc-800">
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-purple-500 inline-block" /> Peor conectados</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Más centrales</span>
        </div>
      </div>

      {/* Panel */}
      {worst && worst.length > 0 && (
        <div className="absolute top-4 right-4 z-[1000] bg-zinc-900/95 backdrop-blur rounded-xl p-4 w-80 max-h-[80vh] overflow-y-auto border border-zinc-800">
          <h3 className="text-sm font-bold mb-3">🟣 Zonas peor conectadas</h3>
          {worst.slice(0, 15).map((n: any, i: number) => (
            <div key={i} className="py-1.5 border-b border-zinc-800 last:border-0">
              <p className="text-sm font-medium">{n.name}</p>
              <p className="text-xs text-zinc-400">Closeness: {Number(n.properties?.closeness || 0).toFixed(4)}</p>
            </div>
          ))}
          <h3 className="text-sm font-bold mt-4 mb-3">🟢 Nodos más centrales</h3>
          {best?.slice(0, 10).map((n: any, i: number) => (
            <div key={i} className="py-1.5 border-b border-zinc-800 last:border-0">
              <p className="text-sm font-medium">{n.name}</p>
              <p className="text-xs text-zinc-400">Betweenness: {Number(n.properties?.betweenness || 0).toFixed(4)}</p>
            </div>
          ))}
        </div>
      )}

      {loading && <div className="absolute inset-0 z-[999] flex items-center justify-center"><Loading /></div>}

      <MapContainer center={BOGOTA_CENTER} zoom={12} className="h-full w-full" zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="GrafoMov" />

        {worst?.map((n: any, i: number) => (
          <CircleMarker key={`w-${i}`} center={[n.coordinates.lat, n.coordinates.lon]}
            radius={8} color="#a855f7" fillColor="#a855f7" fillOpacity={0.5} weight={2}>
            <Popup><b>{n.name}</b><br />Closeness: {Number(n.properties?.closeness || 0).toFixed(4)}<br />⚠️ Zona mal conectada</Popup>
          </CircleMarker>
        ))}

        {best?.map((n: any, i: number) => (
          <CircleMarker key={`b-${i}`} center={[n.coordinates.lat, n.coordinates.lon]}
            radius={12} color="#10b981" fillColor="#10b981" fillOpacity={0.5} weight={2}>
            <Popup><b>{n.name}</b><br />Betweenness: {Number(n.properties?.betweenness || 0).toFixed(4)}<br />✅ Nodo central</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
