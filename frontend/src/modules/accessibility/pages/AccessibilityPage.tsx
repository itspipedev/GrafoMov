import { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { Accessibility } from "lucide-react";
import { MAP_CONFIG } from "../../../shared/config";
import { Loading, Panel } from "../../../shared/ui";
import { useModal } from "../../../shared/hooks/useModal";
import { useAccessibility, useCentrality } from "../hooks/useAccessibility";
import { NodeDetailModal } from "../../map/widgets/NodeDetailModal";
import type { GraphNode } from "../../../shared/types";
import "leaflet/dist/leaflet.css";

export default function AccessibilityPage() {
  const [tab, setTab] = useState<"worst" | "best">("worst");
  const { data: worst, isLoading: l1 } = useAccessibility(30);
  const { data: best, isLoading: l2 } = useCentrality(15);
  const modal = useModal<GraphNode>();

  return (
    <div className="h-screen relative">
      <Panel className="absolute top-4 left-4 z-[1000] px-5 py-3 flex items-center gap-2.5">
        <Accessibility size={18} className="text-purple-400" />
        <span className="text-sm font-bold">Accesibilidad del transporte</span>
      </Panel>

      <Panel className="absolute bottom-6 left-4 z-[1000] px-4 py-2.5 flex gap-5 text-xs">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Peor conectados</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Más centrales</span>
      </Panel>

      {(worst || best) && (
        <Panel className="absolute top-4 right-4 z-[1000] p-5 w-[340px] max-h-[85vh] overflow-y-auto">
          <div className="flex gap-2 mb-4">
            <button type="button" onClick={() => setTab("worst")} className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${tab === "worst" ? "bg-purple-500/20 text-purple-400 shadow-lg" : "bg-slate-800/50 text-slate-500"}`}>🟣 Peor conectados</button>
            <button type="button" onClick={() => setTab("best")} className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${tab === "best" ? "bg-emerald-500/20 text-emerald-400 shadow-lg" : "bg-slate-800/50 text-slate-500"}`}>🟢 Más centrales</button>
          </div>
          {(tab === "worst" ? worst : best)?.map((n) => (
            <button type="button" key={n.id} onClick={() => modal.show(n)}
              className="w-full py-2 border-b border-white/[0.04] last:border-0 cursor-pointer hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition text-left bg-transparent border-none">
              <p className="text-[13px] font-semibold">{n.name}</p>
              <p className="text-[11px] text-slate-500">{tab === "worst" ? `Closeness: ${Number(n.properties.closeness ?? 0).toFixed(4)}` : `Betweenness: ${Number(n.properties.betweenness ?? 0).toFixed(4)}`}</p>
            </button>
          ))}
        </Panel>
      )}

      <NodeDetailModal open={modal.open} node={modal.data} onClose={modal.hide} />
      {(l1 || l2) && <div className="absolute inset-0 z-[999] flex items-center justify-center bg-slate-950/50"><Loading /></div>}

      <MapContainer center={MAP_CONFIG.center} zoom={12} className="h-full w-full" zoomControl={false}>
        <TileLayer url={MAP_CONFIG.tileUrl} attribution={MAP_CONFIG.attribution} />
        {worst?.map((n) => (
          <CircleMarker key={`w-${n.id}`} center={[n.coordinates.lat, n.coordinates.lon]} radius={8} color="#a855f7" fillColor="#a855f7" fillOpacity={0.4} weight={2}>
            <Popup><b>{n.name}</b><br/>Closeness: {Number(n.properties.closeness ?? 0).toFixed(4)}</Popup>
          </CircleMarker>
        ))}
        {best?.map((n) => (
          <CircleMarker key={`b-${n.id}`} center={[n.coordinates.lat, n.coordinates.lon]} radius={12} color="#10b981" fillColor="#10b981" fillOpacity={0.4} weight={2}>
            <Popup><b>{n.name}</b><br/>Betweenness: {Number(n.properties.betweenness ?? 0).toFixed(4)}</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
