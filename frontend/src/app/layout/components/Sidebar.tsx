import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../../shared/config";
import { Map, MessageCircle, BarChart3, AlertTriangle, Accessibility } from "lucide-react";

const NAV = [
  { path: ROUTES.MAP, label: "Mapa", icon: Map },
  { path: ROUTES.CHAT, label: "Chat IA", icon: MessageCircle },
  { path: ROUTES.METRICS, label: "Métricas", icon: BarChart3 },
  { path: ROUTES.SINIESTRALIDAD, label: "Peligro", icon: AlertTriangle },
  { path: ROUTES.ACCESSIBILITY, label: "Acceso", icon: Accessibility },
];

export function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="fixed left-0 top-0 h-screen w-[72px] bg-gradient-to-b from-slate-950 via-[#1a1a2e] to-[#16213e] border-r border-white/[0.04] shadow-[4px_0_24px_rgba(0,0,0,0.3)] flex flex-col items-center py-3 gap-0.5 z-[9999]">
      <Link to={ROUTES.HOME} className="mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-emerald-500/20 animate-pulse">
          GM
        </div>
      </Link>
      {NAV.map(({ path, label, icon: Icon }) => {
        const active = pathname === path;
        return (
          <Link key={path} to={path} title={label}
            className={`w-[52px] h-[52px] rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all
              ${active
                ? "bg-gradient-to-br from-emerald-500/20 to-blue-500/10 border-l-[3px] border-emerald-400 text-emerald-400"
                : "text-slate-500 hover:text-white hover:bg-white/[0.04]"}`}>
            <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
            <span className="text-[9px] font-medium">{label}</span>
          </Link>
        );
      })}
      <div className="mt-auto">
        <span className="text-[8px] text-slate-600 font-mono">v0.1</span>
      </div>
    </aside>
  );
}
