import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="animate-spin text-emerald-400" />
    </div>
  );
}

export function EmptyState({ message = "No hay datos" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
      <p className="text-lg">{message}</p>
    </div>
  );
}
