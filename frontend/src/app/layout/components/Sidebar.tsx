import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../../shared/config";
import { Map, MessageCircle, BarChart3, AlertTriangle, Accessibility } from "lucide-react";

const NAV_ITEMS = [
  { path: ROUTES.MAP, label: "Mapa", icon: Map },
  { path: ROUTES.CHAT, label: "Chat IA", icon: MessageCircle },
  { path: ROUTES.METRICS, label: "Métricas", icon: BarChart3 },
  { path: ROUTES.SINIESTRALIDAD, label: "Peligro", icon: AlertTriangle },
  { path: ROUTES.ACCESSIBILITY, label: "Acceso", icon: Accessibility },
];

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="sidebar fixed left-0 top-0 h-screen w-[72px] flex flex-col items-center py-5 gap-1 z-50">
      {/* Logo */}
      <Link to={ROUTES.HOME} className="mb-6">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-black text-sm glow">
          GM
        </div>
      </Link>

      {/* Nav items */}
      {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
        const active = pathname === path;
        return (
          <Link
            key={path}
            to={path}
            className={`sidebar-item w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-0.5 ${
              active ? "active text-emerald-400" : "text-slate-400 hover:text-white"
            }`}
            title={label}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
            <span className="text-[9px] font-medium">{label}</span>
          </Link>
        );
      })}

      {/* Bottom spacer + version */}
      <div className="mt-auto">
        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[8px] text-slate-500 font-mono">
          v0.1
        </div>
      </div>
    </aside>
  );
}
