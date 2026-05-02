import { MapContainer, TileLayer, CircleMarker, useMapEvents } from "react-leaflet";
import { MAP_CONFIG } from "../../../shared/config";
import { useToggle } from "../../../shared/hooks/useToggle";
import { useModal } from "../../../shared/hooks/useModal";
import { Loading } from "../../../shared/ui";
import { useStations, useParaderos, useNearbySearch } from "../hooks/useMap";
import { StationMarker, ParaderoMarker, NearbyMarker } from "../ui";
import { MapControls } from "../widgets/MapControls";
import { NearbyPanel } from "../widgets/NearbyPanel";
import { NodeDetailModal } from "../widgets/NodeDetailModal";
import type { GraphNode } from "../../../shared/types";
import "leaflet/dist/leaflet.css";

function ClickHandler({ onClick }: Readonly<{ onClick: (lat: number, lon: number) => void }>) {
  useMapEvents({ click: (e) => onClick(e.latlng.lat, e.latlng.lng) });
  return null;
}

export default function MapPage() {
  const [showTM, toggleTM] = useToggle(true);
  const [showSITP, toggleSITP] = useToggle(false);
  const { nearby, clickPos, search } = useNearbySearch();
  const modal = useModal<GraphNode>();

  const { data: stations, isLoading: loadingTM } = useStations(showTM);
  const { data: paraderos, isLoading: loadingSITP } = useParaderos(showSITP);

  return (
    <div className="h-screen relative">
      <MapControls showTM={showTM} showSITP={showSITP} onToggleTM={toggleTM} onToggleSITP={toggleSITP} />
      <NearbyPanel results={nearby} onSelect={(n) => modal.show(n)} />
      <NodeDetailModal open={modal.open} node={modal.data} onClose={modal.hide} />

      {(loadingTM || loadingSITP) && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center bg-slate-950/50"><Loading /></div>
      )}

      <MapContainer center={MAP_CONFIG.center} zoom={MAP_CONFIG.zoom} className="h-full w-full" zoomControl={false}>
        <TileLayer url={MAP_CONFIG.tileUrl} attribution={MAP_CONFIG.attribution} />
        <ClickHandler onClick={search} />
        {showTM && stations?.map((n) => <StationMarker key={n.id} node={n} />)}
        {showSITP && paraderos?.map((n) => <ParaderoMarker key={n.id} node={n} />)}
        {clickPos && <CircleMarker center={clickPos} radius={14} color="#10b981" fillOpacity={0.15} weight={2} />}
        {nearby.map((item, i) => <NearbyMarker key={i} node={item.node} distance={item.distance_km} />)}
      </MapContainer>
    </div>
  );
}
