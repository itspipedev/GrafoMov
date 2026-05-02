import { Loader2 } from "lucide-react";

type Props = Readonly<{ text?: string }>;

export function Loading({ text = "Cargando..." }: Props) {
  return (
    <div className="flex items-center justify-center h-64 gap-3">
      <Loader2 size={24} className="animate-spin text-emerald-400" />
      <span className="text-sm text-slate-400">{text}</span>
    </div>
  );
}
