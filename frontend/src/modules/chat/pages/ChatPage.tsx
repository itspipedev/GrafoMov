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
      setMessages((p) => [...p, { role: "assistant", content: "Error al conectar con el agente." }]);
    }
    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Bot size={20} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="font-bold">GrafoMov IA</h1>
            <p className="text-xs text-zinc-400">Pregúntale sobre la movilidad de Bogotá</p>
          </div>
        </div>
        <button onClick={() => { agentApi.reset(); setMessages([]); }} className="p-2 rounded-lg hover:bg-zinc-800">
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 && (
          <div className="text-center text-zinc-500 mt-20">
            <Bot size={48} className="mx-auto mb-4 text-zinc-600" />
            <p className="text-lg font-medium">¿Qué quieres saber?</p>
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              {["¿Zonas más peligrosas?", "¿Paraderos cerca del centro?", "¿Nodo más central?"].map((q) => (
                <button key={q} onClick={() => setInput(q)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 hover:bg-zinc-800">{q}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 mb-4 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-emerald-400" />
              </div>
            )}
            <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
              msg.role === "user" ? "bg-emerald-600" : "bg-zinc-800 text-zinc-200"
            }`}>{msg.content}</div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Bot size={16} className="text-emerald-400 animate-pulse" />
            </div>
            <div className="bg-zinc-800 rounded-2xl px-4 py-3 flex gap-1">
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.1s]" />
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-6 py-4 border-t border-zinc-800">
        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500" />
          <button type="submit" disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl px-4 py-3">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
