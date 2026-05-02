import type { NearbyResult, GraphNode } from "../../../shared/types";
import { Panel } from "../../../shared/ui";
import { Badge } from "../../../shared/ui";

type Props = Readonly<{
  results: NearbyResult[];
  onSelect?: (node: GraphNode) => void;
}>;

export function NearbyPanel({ results, onSelect }: Props) {
  if (!results.length) return null;
  return (
    <Panel className="absolute top-4 right-4 z-[1000] p-4 w-80 max-h-[80vh] overflow-y-auto animate-[fadeIn_0.3s_ease-out]">
      <h3 className="text-sm font-bold mb-3">📍 {results.length} paraderos cercanos</h3>
      {results.map((item, i) => (
        <button type="button" key={i} onClick={() => onSelect?.(item.node)}
          className="w-full flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0 cursor-pointer hover:bg-white/[0.02] -mx-1 px-1 rounded-lg transition text-left bg-transparent border-none">
          <div>
            <p className="text-[13px] font-semibold">{item.node.name}</p>
            <p className="text-[11px] text-slate-500">{item.node.properties.direccion}</p>
          </div>
          <Badge variant="success">{item.distance_km} km</Badge>
        </button>
      ))}
    </Panel>
  );
}
