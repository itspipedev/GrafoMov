import type { GraphNode } from "../../../shared/types";
import { Modal } from "../../../shared/ui";
import { Badge } from "../../../shared/ui";

type Props = Readonly<{
  open: boolean;
  node: GraphNode | null;
  onClose: () => void;
}>;

/** Extends base Modal with node-specific content */
export function NodeDetailModal({ open, node, onClose }: Props) {
  if (!node) return null;

  const rows: Array<{ label: string; value: string | number; badge?: boolean; variant?: "danger" }> = [
    { label: "Tipo", value: node.node_type },
    { label: "Latitud", value: node.coordinates.lat.toFixed(6) },
    { label: "Longitud", value: node.coordinates.lon.toFixed(6) },
  ];
  if (node.properties.troncal) rows.push({ label: "Troncal", value: node.properties.troncal });
  if (node.properties.direccion) rows.push({ label: "Dirección", value: node.properties.direccion });
  if (node.properties.grado) rows.push({ label: "Grado", value: node.properties.grado });
  if (node.properties.betweenness) rows.push({ label: "Betweenness", value: Number(node.properties.betweenness).toFixed(4) });
  if (Number(node.properties.siniestralidad_score) > 0) rows.push({ label: "Siniestralidad", value: Number(node.properties.siniestralidad_score).toFixed(2), badge: true, variant: "danger" });

  return (
    <Modal open={open} onClose={onClose} title={node.name || "Detalle del nodo"}>
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">{r.label}</span>
            {r.badge ? <Badge variant={r.variant}>{r.value}</Badge> : <span className="text-sm font-mono">{r.value}</span>}
          </div>
        ))}
      </div>
    </Modal>
  );
}
