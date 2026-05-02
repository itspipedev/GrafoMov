import { useState, useRef, useEffect, useCallback } from "react";
import { agentApi } from "../../../shared/api/client";
import type { ChatMessage } from "../../../shared/types";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages((p) => [...p, { role: "user", content: text.trim() }]);
    setLoading(true);
    try {
      const res = await agentApi.chat(text.trim());
      setMessages((p) => [...p, { role: "assistant", content: res.response }]);
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "⚠️ Backend no disponible." }]);
    }
    setLoading(false);
  }, [loading]);

  const reset = useCallback(async () => {
    await agentApi.reset().catch(() => {});
    setMessages([]);
  }, []);

  return { messages, loading, send, reset, bottomRef };
}
