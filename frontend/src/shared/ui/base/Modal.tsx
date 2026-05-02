import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

type Props = Readonly<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}>;

export function Modal({ open, onClose, title, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="fixed inset-0 z-[9999] bg-transparent backdrop:bg-black/60 backdrop:backdrop-blur-sm w-full max-w-lg rounded-2xl border border-white/[0.08] bg-slate-900 shadow-2xl p-0 overflow-hidden"
      aria-label={title}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <h2 className="text-lg font-bold text-slate-100">{title}</h2>
        <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition" aria-label="Cerrar">
          <X size={18} />
        </button>
      </div>
      <div className="px-6 py-4 overflow-y-auto max-h-[60vh] text-slate-100">{children}</div>
    </dialog>
  );
}
