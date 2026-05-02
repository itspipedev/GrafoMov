import type { ReactNode } from "react";

type Props = Readonly<{
  icon: ReactNode;
  label: string;
  value: string | number;
  gradient: string;
}>;

export function MetricCard({ icon, label, value, gradient }: Props) {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4 hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient}`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black tracking-tight">{value}</p>
      </div>
    </div>
  );
}
