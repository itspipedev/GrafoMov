type Props = Readonly<{
  showTM: boolean;
  showSITP: boolean;
  onToggleTM: () => void;
  onToggleSITP: () => void;
}>;

export function MapControls({ showTM, showSITP, onToggleTM, onToggleSITP }: Props) {
  return (
    <div className="absolute top-4 left-4 z-[1000] flex gap-2">
      <button type="button" onClick={onToggleTM}
        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${showTM ? "bg-red-600/90 text-white shadow-lg shadow-red-500/20" : "bg-slate-800/90 text-slate-400 hover:bg-slate-700"}`}>
        🔴 Transmilenio
      </button>
      <button type="button" onClick={onToggleSITP}
        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${showSITP ? "bg-blue-600/90 text-white shadow-lg shadow-blue-500/20" : "bg-slate-800/90 text-slate-400 hover:bg-slate-700"}`}>
        🔵 SITP
      </button>
    </div>
  );
}
