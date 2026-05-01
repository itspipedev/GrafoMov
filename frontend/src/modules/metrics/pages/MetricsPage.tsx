import { useQuery } from "@tanstack/react-query";
import { graphApi } from "../../../shared/api/client";
import { Loading } from "../../../shared/ui";
import { Network, GitBranch, AlertTriangle, Car, Users, Skull, TrendingUp } from "lucide-react";

const cardStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #1e293b, #0f172a)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 16, padding: 20, display: "flex", alignItems: "center", gap: 16,
};

function MetricCard({ icon: Icon, label, value, from, to }: any) {
  return (
    <div style={cardStyle}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${from}, ${to})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={22} color="white" />
      </div>
      <div>
        <p style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>{label}</p>
        <p style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>{value}</p>
      </div>
    </div>
  );
}

function StatCard({ emoji, label, value, tag }: any) {
  return (
    <div style={{ ...cardStyle, flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
      <p style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{emoji} {label}</p>
      <p style={{ fontSize: 20, fontWeight: 800 }}>{value}</p>
      {tag && <span style={{ fontSize: 10, padding: "2px 10px", borderRadius: 99, background: "rgba(245,158,11,0.15)", color: "#fbbf24", fontWeight: 600, marginTop: 4 }}>{tag}</span>}
    </div>
  );
}

const grid4: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 };
const grid3: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 };
const sectionTitle: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 };

export default function MetricsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["metrics"], queryFn: graphApi.getMetrics });
  if (isLoading || !data) return <Loading />;
  const a = data.graph_attributes || {};

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5, marginBottom: 4 }}>Dashboard de Movilidad</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 32 }}>Bogotá D.C. — Datos abiertos en tiempo real</p>

      <p style={sectionTitle}>🔗 Grafo de Transporte</p>
      <div style={grid4}>
        <MetricCard icon={Network} label="Nodos" value={data.total_nodes.toLocaleString()} from="#3b82f6" to="#06b6d4" />
        <MetricCard icon={GitBranch} label="Aristas" value={data.total_edges.toLocaleString()} from="#10b981" to="#14b8a6" />
        <MetricCard icon={TrendingUp} label="Componente mayor" value={data.largest_component_size.toLocaleString()} from="#f59e0b" to="#f97316" />
        <MetricCard icon={Network} label="Grado promedio" value={data.avg_degree} from="#a855f7" to="#ec4899" />
      </div>

      <p style={sectionTitle}>🚨 Siniestralidad 2024</p>
      <div style={grid4}>
        <MetricCard icon={AlertTriangle} label="Total accidentes" value={Number(a.accidentes_total || 0).toLocaleString()} from="#ef4444" to="#f43f5e" />
        <MetricCard icon={Users} label="Con heridos" value={Number(a.accidentes_con_heridos || 0).toLocaleString()} from="#f59e0b" to="#eab308" />
        <MetricCard icon={Skull} label="Con muertos" value={Number(a.accidentes_con_muertos || 0).toLocaleString()} from="#dc2626" to="#991b1b" />
        <StatCard emoji="🏍️" label="Vehículo #1 en accidentes" value={a.accidentes_top_vehiculo || ""} />
      </div>

      <p style={sectionTitle}>🚗 Parque Automotor</p>
      <div style={grid4}>
        <MetricCard icon={Car} label="Total" value={Number(a.parque_automotor_total || 0).toLocaleString()} from="#3b82f6" to="#6366f1" />
        <StatCard emoji="🚗" label="Automóviles" value={Number(a.parque_automovil || 0).toLocaleString()} />
        <StatCard emoji="🏍️" label="Motocicletas" value={Number(a.parque_motocicleta || 0).toLocaleString()} />
        <StatCard emoji="🚙" label="Camionetas" value={Number(a.parque_camioneta || 0).toLocaleString()} />
      </div>

      <p style={sectionTitle}>📈 Demanda Transmilenio</p>
      <div style={grid3}>
        <MetricCard icon={Users} label="Promedio/día" value={Number(a.demanda_promedio_dia || 0).toLocaleString()} from="#10b981" to="#22c55e" />
        <MetricCard icon={TrendingUp} label="Máximo/día" value={Number(a.demanda_max_dia || 0).toLocaleString()} from="#3b82f6" to="#0ea5e9" />
        <StatCard emoji="📅" label="Período" value={a.demanda_periodo || ""} tag="⚠️ Datos pandemia" />
      </div>
    </div>
  );
}
