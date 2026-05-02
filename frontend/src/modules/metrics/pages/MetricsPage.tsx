import { Network, GitBranch, AlertTriangle, Car, Users, Skull, TrendingUp } from "lucide-react";
import { useMetrics } from "../hooks/useMetrics";
import { Loading, MetricCard, SectionTitle } from "../../../shared/ui";
import { fmt } from "../../../shared/utils";

function StatCard({ emoji, label, value, tag }: Readonly<{ emoji: string; label: string; value: string; tag?: string }>) {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/[0.06] rounded-2xl p-5">
      <p className="text-[11px] text-slate-400 font-semibold">{emoji} {label}</p>
      <p className="text-xl font-black mt-1">{value}</p>
      {tag && <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-semibold mt-2 inline-block">{tag}</span>}
    </div>
  );
}

export default function MetricsPage() {
  const { data, isLoading } = useMetrics();
  if (isLoading || !data) return <Loading />;
  const a = data.graph_attributes;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black tracking-tight mb-1">Dashboard de Movilidad</h1>
      <p className="text-slate-500 text-sm mb-8">Bogotá D.C. — Datos abiertos en tiempo real</p>

      <SectionTitle>🔗 Grafo de Transporte</SectionTitle>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <MetricCard icon={<Network size={22} className="text-white" />} label="Nodos" value={fmt.number(data.total_nodes)} gradient="from-blue-500 to-cyan-500" />
        <MetricCard icon={<GitBranch size={22} className="text-white" />} label="Aristas" value={fmt.number(data.total_edges)} gradient="from-emerald-500 to-teal-500" />
        <MetricCard icon={<TrendingUp size={22} className="text-white" />} label="Componente mayor" value={fmt.number(data.largest_component_size)} gradient="from-amber-500 to-orange-500" />
        <MetricCard icon={<Network size={22} className="text-white" />} label="Grado promedio" value={String(data.avg_degree)} gradient="from-purple-500 to-pink-500" />
      </div>

      <SectionTitle>🚨 Siniestralidad 2024</SectionTitle>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <MetricCard icon={<AlertTriangle size={22} className="text-white" />} label="Total accidentes" value={fmt.number(a.accidentes_total ?? 0)} gradient="from-red-500 to-rose-500" />
        <MetricCard icon={<Users size={22} className="text-white" />} label="Con heridos" value={fmt.number(a.accidentes_con_heridos ?? 0)} gradient="from-amber-500 to-yellow-500" />
        <MetricCard icon={<Skull size={22} className="text-white" />} label="Con muertos" value={fmt.number(a.accidentes_con_muertos ?? 0)} gradient="from-red-600 to-red-800" />
        <StatCard emoji="🏍️" label="Vehículo #1" value={String(a.accidentes_top_vehiculo ?? "")} />
      </div>

      <SectionTitle>🚗 Parque Automotor</SectionTitle>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <MetricCard icon={<Car size={22} className="text-white" />} label="Total" value={fmt.number(a.parque_automotor_total ?? 0)} gradient="from-blue-500 to-indigo-500" />
        <StatCard emoji="🚗" label="Automóviles" value={fmt.number(a.parque_automovil ?? 0)} />
        <StatCard emoji="🏍️" label="Motocicletas" value={fmt.number(a.parque_motocicleta ?? 0)} />
        <StatCard emoji="🚙" label="Camionetas" value={fmt.number(a.parque_camioneta ?? 0)} />
      </div>

      <SectionTitle>📈 Demanda Transmilenio</SectionTitle>
      <div className="grid grid-cols-3 gap-4">
        <MetricCard icon={<Users size={22} className="text-white" />} label="Promedio/día" value={fmt.number(a.demanda_promedio_dia ?? 0)} gradient="from-emerald-500 to-green-500" />
        <MetricCard icon={<TrendingUp size={22} className="text-white" />} label="Máximo/día" value={fmt.number(a.demanda_max_dia ?? 0)} gradient="from-blue-500 to-sky-500" />
        <StatCard emoji="📅" label="Período" value={String(a.demanda_periodo ?? "")} tag="⚠️ Datos pandemia" />
      </div>
    </div>
  );
}
