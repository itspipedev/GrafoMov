import { CircleMarker, Popup } from "react-leaflet";
import type { GraphNode } from "../../../shared/types";
import { COLORS } from "../../../shared/config";

type Props = Readonly<{ node: GraphNode; distance: number }>;

export function NearbyMarker({ node, distance }: Props) {
  return (
    <CircleMarker center={[node.coordinates.lat, node.coordinates.lon]} radius={7}
      color={COLORS.success} fillOpacity={0.8} weight={2}>
      <Popup><b>{node.name}</b><br />{distance} km</Popup>
    </CircleMarker>
  );
}
