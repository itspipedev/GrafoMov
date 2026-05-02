import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { AlertTriangle } from "lucide-react";
import { MAP_CONFIG } from "../../../shared/config";
import { Loading, Panel, Badge } from "../../../shared/ui";
import { useModal } from "../../../shared/hooks/useModal";
import { useSiniestralidad } from "../hooks/useSiniestralidad";
import { NodeDetailModal } from "../../map/widgets/NodeDetailModal";
import type { GraphNode } from "../../../shared/types";
import "leaflet/dist/leaflet.css";

export default function SiniestralidadPage() {
  const { data, isLoading } = useSiniestralidad(30);
  const modal = useModal<GraphNode>();

  return (
    <div className="h-screen relative">
      <Panel className="absolute top-4 left-4 z-[1000] px-5 py-3 flex items-center gap-2.5">
        <AlertTriangle size={18} className="text-red-400" />
        <span className="text-sm font-bold">Zonas con mayor siniestralidad</span>
      </Panel>

      {data?.length ? (
        <Panel className="absolute top-4 right-4 z-[1000] p-5 w-[340px] max-h-[85vh] overflow-y-auto">
          <h3 className="text-sm font-bold mb-4">🚨 Top {data.length} zonas peligrosas</h3>
          {data.map((n) => (
            <button type="button" key={n.id} onClick={() => modal.show(n)}
              className="w-full flex justify-between items-start py-2.5 border-b border-white/[0.04] last:border-0 cursor-pointer hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition text-left bg-transparent border-none">
              <div>
                <p className="text-[13px] font-semibold">{n.name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Score: {Number(n.properties.siniestralidad_score ?? 0).toFixed(2)} | Grado: {n.properties.grado}</p>
              </div>
              <Badge variant="danger">{n.properties.fallecidos_cercanos} 💀</Badge>
            </button>
          ))}
        </Panel>
      ) : null}

      <NodeDetailModal open={modal.open} node={modal.data} onClose={modal.hide} />
      {isLoading && <div className="absolute inset-0 z-[999] flex items-center justify-center bg-slate-950/50"><Loading /></div>}

      <MapContainer center={MAP_CONFIG.center} zoom={12} className="h-full w-full" zoomControl={false}>
        <TileLayer url={MAP_CONFIG.tileUrl} attribution={MAP_CONFIG.attribution} />
        {data?.map((n) => (
          <CircleMarker key={n.id} center={[n.coordinates.lat, n.coordinates.lon]}
            radius={Math.max(8, Number(n.properties.siniestralidad_score ?? 0) * 5)}
            color="#ef4444" fillColor="#ef4444" fillOpacity={0.35} weight={2}>
            <Popup><b>{n.name}</b><br/>⚠️ Score: {Number(n.properties.siniestralidad_score ?? 0).toFixed(2)}<br/>💀 Fallecidos: {n.properties.fallecidos_cercanos}</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
