import type { Coordinates } from "./coordinates";
import type { NodeProperties } from "./node-properties";

export interface GraphNode {
  id: string;
  name: string;
  node_type: "estacion_tm" | "paradero_sitp" | "interseccion_vial" | "conexion_troncal";
  coordinates: Coordinates;
  properties: NodeProperties;
}
