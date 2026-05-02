import { CircleMarker, Popup } from "react-leaflet";
import type { GraphNode } from "../../../shared/types";
import { COLORS } from "../../../shared/config";

type Props = Readonly<{ node: GraphNode }>;

export function StationMarker({ node }: Props) {
  return (
    <CircleMarker center={[node.coordinates.lat, node.coordinates.lon]} radius={8}
      color={COLORS.estacion_tm} fillOpacity={0.9} weight={2}>
      <Popup><b>{node.name}</b><br />{node.properties.troncal}<br />Grado: {node.properties.grado}</Popup>
    </CircleMarker>
  );
}
