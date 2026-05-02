import type { ReactNode } from "react";

type Props = Readonly<{ children: ReactNode; className?: string }>;

export function Panel({ children, className = "" }: Props) {
  return (
    <div className={`bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-white/[0.06] rounded-2xl shadow-2xl ${className}`}>
      {children}
    </div>
  );
}
