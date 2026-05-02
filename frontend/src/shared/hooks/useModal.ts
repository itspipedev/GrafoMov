import { useState, useCallback } from "react";

export function useModal<T = unknown>() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const show = useCallback((d?: T) => { setData(d ?? null); setOpen(true); }, []);
  const hide = useCallback(() => { setOpen(false); setData(null); }, []);
  return { open, data, show, hide } as const;
}
