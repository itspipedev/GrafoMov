export interface NodeProperties {
  troncal?: string;
  cenefa?: string;
  direccion?: string;
  localidad?: string;
  siniestralidad_score?: number;
  fallecidos_cercanos?: number;
  grado?: number;
  betweenness?: number;
  closeness?: number;
  highway?: string;
  [key: string]: unknown;
}
