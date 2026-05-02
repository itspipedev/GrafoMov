import { CircleMarker, Popup } from "react-leaflet";
import type { GraphNode } from "../../../shared/types";
import { COLORS } from "../../../shared/config";

type Props = Readonly<{ node: GraphNode }>;

export function ParaderoMarker({ node }: Props) {
  return (
    <CircleMarker center={[node.coordinates.lat, node.coordinates.lon]} radius={3}
      color={COLORS.paradero_sitp} fillOpacity={0.7} weight={1}>
      <Popup><b>{node.name}</b><br />{node.properties.direccion}</Popup>
    </CircleMarker>
  );
}
