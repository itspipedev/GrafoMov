import type { ReactNode } from "react";

export type BadgeVariant = "success" | "danger" | "warning" | "info" | "purple" | "default";

type Props = Readonly<{ children: ReactNode; variant?: BadgeVariant }>;

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/15 text-emerald-400",
  danger: "bg-red-500/15 text-red-400",
  warning: "bg-amber-500/15 text-amber-400",
  info: "bg-blue-500/15 text-blue-400",
  purple: "bg-purple-500/15 text-purple-400",
  default: "bg-slate-500/15 text-slate-400",
};

export function Badge({ children, variant = "default" }: Props) {
  return (
    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${VARIANT_CLASSES[variant]}`}>
      {children}
    </span>
  );
}
