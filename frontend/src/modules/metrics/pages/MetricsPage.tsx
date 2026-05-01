import { useQuery } from "@tanstack/react-query";
import { graphApi } from "../../../shared/api/client";
import { Loading } from "../../../shared/ui";
import { Network, GitBranch, AlertTriangle, Car, Users, Skull, TrendingUp } from "lucide-react";

function MetricCard({ icon: Icon, label, value, gradient }: any) {
  return (
    <div className="metric-card flex items-center gap-4 animate-fadeIn">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradient}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ emoji, label, value, extra }: { emoji: string; label: string; value: string; extra?: string }) {
  return (
    <div className="metric-card animate-fadeIn">
      <p className="text-xs text-slate-400 font-medium">{emoji} {label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
      {extra && <span className="badge badge-warning mt-2 inline-block">{extra}</span>}
    </div>
  );
}

export default function MetricsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["metrics"], queryFn: graphApi.getMetrics });
  if (isLoading || !data) return <Loading />;
  const a = data.graph_attributes || {};

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Dashboard de Movilidad</h1>
        <p className="text-slate-400 mt-1">Bogotá D.C. — Datos abiertos en tiempo real</p>
      </div>

      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">🔗 Grafo de Transporte</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <MetricCard icon={Network} label="Nodos" value={data.total_nodes.toLocaleString()} gradient="from-blue-500 to-cyan-500" />
        <MetricCard icon={GitBranch} label="Aristas" value={data.total_edges.toLocaleString()} gradient="from-emerald-500 to-teal-500" />
        <MetricCard icon={TrendingUp} label="Componente mayor" value={`${data.largest_component_size.toLocaleString()}`} gradient="from-amber-500 to-orange-500" />
        <MetricCard icon={Network} label="Grado promedio" value={data.avg_degree} gradient="from-purple-500 to-pink-500" />
      </div>

      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">🚨 Siniestralidad 2024</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <MetricCard icon={AlertTriangle} label="Total accidentes" value={Number(a.accidentes_total || 0).toLocaleString()} gradient="from-red-500 to-rose-500" />
        <MetricCard icon={Users} label="Con heridos" value={Number(a.accidentes_con_heridos || 0).toLocaleString()} gradient="from-amber-500 to-yellow-500" />
        <MetricCard icon={Skull} label="Con muertos" value={Number(a.accidentes_con_muertos || 0).toLocaleString()} gradient="from-red-600 to-red-800" />
        <StatCard emoji="🏍️" label="Vehículo #1 en accidentes" value={a.accidentes_top_vehiculo || ""} />
      </div>

      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">🚗 Parque Automotor</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <MetricCard icon={Car} label="Total vehículos" value={Number(a.parque_automotor_total || 0).toLocaleString()} gradient="from-blue-500 to-indigo-500" />
        <StatCard emoji="🚗" label="Automóviles" value={Number(a.parque_automovil || 0).toLocaleString()} />
        <StatCard emoji="🏍️" label="Motocicletas" value={Number(a.parque_motocicleta || 0).toLocaleString()} />
        <StatCard emoji="🚙" label="Camionetas" value={Number(a.parque_camioneta || 0).toLocaleString()} />
      </div>

      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">📈 Demanda Transmilenio</h2>
      <div className="grid grid-cols-3 gap-4">
        <MetricCard icon={Users} label="Promedio/día" value={Number(a.demanda_promedio_dia || 0).toLocaleString()} gradient="from-emerald-500 to-green-500" />
        <MetricCard icon={TrendingUp} label="Máximo/día" value={Number(a.demanda_max_dia || 0).toLocaleString()} gradient="from-blue-500 to-sky-500" />
        <StatCard emoji="📅" label="Período" value={a.demanda_periodo || ""} extra="⚠️ Datos pandemia" />
      </div>
    </div>
  );
}
