import type { ReactNode } from "react";

type Props = Readonly<{ message?: string; icon?: ReactNode }>;

export function EmptyState({ message = "No hay datos", icon }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-2">
      {icon}
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
}
