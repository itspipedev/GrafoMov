import { useQuery } from "@tanstack/react-query";
import { graphApi } from "../../../shared/api/client";
import { Loading } from "../../../shared/ui";
import { Network, GitBranch, AlertTriangle, Car, Users, Skull } from "lucide-react";

function MetricCard({ icon: Icon, label, value, color = "emerald" }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl bg-${color}-500/20 flex items-center justify-center`}>
        <Icon size={24} className={`text-${color}-400`} />
      </div>
      <div>
        <p className="text-xs text-zinc-400">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, extra }: { label: string; value: string; extra?: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="text-lg font-bold">{value}</p>
      {extra && <p className="text-xs text-amber-400 mt-1">{extra}</p>}
    </div>
  );
}

export default function MetricsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["metrics"], queryFn: graphApi.getMetrics });

  if (isLoading || !data) return <Loading />;
  const a = data.graph_attributes || {};

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📊 Dashboard de Movilidad</h1>

      <h2 className="text-lg font-semibold mb-3 text-zinc-300">Grafo de Transporte</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard icon={Network} label="Nodos" value={data.total_nodes.toLocaleString()} color="blue" />
        <MetricCard icon={GitBranch} label="Aristas" value={data.total_edges.toLocaleString()} color="emerald" />
        <MetricCard icon={Network} label="Componentes" value={data.connected_components} color="amber" />
        <MetricCard icon={GitBranch} label="Grado máx" value={data.max_degree} color="purple" />
      </div>

      <h2 className="text-lg font-semibold mb-3 text-zinc-300">🚨 Siniestralidad 2024</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard icon={AlertTriangle} label="Total accidentes" value={Number(a.accidentes_total || 0).toLocaleString()} color="red" />
        <MetricCard icon={Users} label="Con heridos" value={Number(a.accidentes_con_heridos || 0).toLocaleString()} color="amber" />
        <MetricCard icon={Skull} label="Con muertos" value={Number(a.accidentes_con_muertos || 0).toLocaleString()} color="red" />
        <StatCard label="Vehículo #1" value={`🏍️ ${a.accidentes_top_vehiculo || ""}`} />
      </div>

      <h2 className="text-lg font-semibold mb-3 text-zinc-300">🚗 Parque Automotor Bogotá</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard icon={Car} label="Total" value={Number(a.parque_automotor_total || 0).toLocaleString()} color="blue" />
        <StatCard label="🚗 Automóviles" value={Number(a.parque_automovil || 0).toLocaleString()} />
        <StatCard label="🏍️ Motos" value={Number(a.parque_motocicleta || 0).toLocaleString()} />
        <StatCard label="🚙 Camionetas" value={Number(a.parque_camioneta || 0).toLocaleString()} />
      </div>

      <h2 className="text-lg font-semibold mb-3 text-zinc-300">📈 Demanda Transmilenio</h2>
      <div className="grid grid-cols-3 gap-4">
        <MetricCard icon={Users} label="Promedio/día" value={Number(a.demanda_promedio_dia || 0).toLocaleString()} color="emerald" />
        <MetricCard icon={Users} label="Máximo/día" value={Number(a.demanda_max_dia || 0).toLocaleString()} color="blue" />
        <StatCard label="Período" value={a.demanda_periodo || ""} extra="⚠️ Datos pandemia" />
      </div>
    </div>
  );
}
