import type { ReactNode } from "react";

type Props = Readonly<{ children: ReactNode }>;

export function SectionTitle({ children }: Props) {
  return <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">{children}</h2>;
}
