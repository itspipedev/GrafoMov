import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../../shared/config";
import { Map, MessageCircle, BarChart3, AlertTriangle, Accessibility } from "lucide-react";

const NAV_ITEMS = [
  { path: ROUTES.MAP, label: "Mapa", icon: Map },
  { path: ROUTES.CHAT, label: "Chat IA", icon: MessageCircle },
  { path: ROUTES.METRICS, label: "Métricas", icon: BarChart3 },
  { path: ROUTES.SINIESTRALIDAD, label: "Peligro", icon: AlertTriangle },
  { path: ROUTES.ACCESSIBILITY, label: "Accesibilidad", icon: Accessibility },
];

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-zinc-900 flex flex-col items-center py-4 gap-2 z-50">
      <Link to={ROUTES.HOME} className="mb-4">
        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
          GM
        </div>
      </Link>

      {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
        const active = pathname === path;
        return (
          <Link
            key={path}
            to={path}
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-colors ${
              active ? "bg-emerald-500/20 text-emerald-400" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
            title={label}
          >
            <Icon size={20} />
            <span className="text-[9px]">{label}</span>
          </Link>
        );
      })}
    </aside>
  );
}
