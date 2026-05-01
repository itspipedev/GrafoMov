import { useState, useRef, useEffect } from "react";
import { Send, RotateCcw, Bot, User } from "lucide-react";
import { agentApi } from "../../../shared/api/client";

interface Message { role: "user" | "assistant"; content: string; }

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput("");
    setMessages((p) => [...p, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const res = await agentApi.chat(msg);
      setMessages((p) => [...p, { role: "assistant", content: res.response }]);
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "⚠️ Backend no disponible. Ejecuta: cd backend && uvicorn main:app --reload" }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bot size={18} color="#34d399" />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15 }}>GrafoMov IA</p>
            <p style={{ fontSize: 11, color: "#64748b" }}>Pregúntale sobre la movilidad de Bogotá</p>
          </div>
        </div>
        <button onClick={() => { agentApi.reset().catch(() => {}); setMessages([]); }}
          style={{ padding: 8, borderRadius: 8, background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 24px" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#475569", marginTop: 80 }}>
            <Bot size={40} color="#334155" style={{ margin: "0 auto 16px" }} />
            <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>¿Qué quieres saber?</p>
            <p style={{ fontSize: 13, color: "#475569", marginBottom: 24 }}>Pregunta sobre estaciones, rutas, zonas peligrosas o accesibilidad</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {["¿Zonas más peligrosas?", "¿Paraderos cerca del centro?", "¿Nodo más central?"].map((q) => (
                <button key={q} onClick={() => setInput(q)} style={{
                  fontSize: 12, padding: "8px 16px", borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.1)", background: "rgba(30,41,59,0.8)",
                  color: "#94a3b8", cursor: "pointer", transition: "all 0.2s",
                }}>{q}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 16, justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            {msg.role === "assistant" && (
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Bot size={14} color="#34d399" />
              </div>
            )}
            <div style={{
              maxWidth: "65%", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding: "12px 16px", fontSize: 14, lineHeight: 1.5, whiteSpace: "pre-wrap",
              background: msg.role === "user" ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #1e293b, #334155)",
              border: msg.role === "assistant" ? "1px solid rgba(255,255,255,0.06)" : "none",
              color: msg.role === "user" ? "white" : "#cbd5e1",
            }}>{msg.content}</div>
            {msg.role === "user" && (
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#334155", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <User size={14} color="#94a3b8" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bot size={14} color="#34d399" className="animate-pulse" />
            </div>
            <div style={{ background: "#1e293b", borderRadius: 18, padding: "12px 16px", display: "flex", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#475569", animation: "bounce 1s infinite" }} />
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#475569", animation: "bounce 1s infinite 0.1s" }} />
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#475569", animation: "bounce 1s infinite 0.2s" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <form onSubmit={(e) => { e.preventDefault(); send(); }} style={{ display: "flex", gap: 8 }}>
          <input value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            style={{
              flex: 1, background: "#1e293b", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14, padding: "12px 16px", fontSize: 14, color: "#e2e8f0",
              outline: "none",
            }} />
          <button type="submit" disabled={loading} style={{
            background: "linear-gradient(135deg, #10b981, #059669)",
            border: "none", borderRadius: 14, padding: "12px 16px", cursor: "pointer",
            opacity: loading ? 0.5 : 1, color: "white",
          }}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
