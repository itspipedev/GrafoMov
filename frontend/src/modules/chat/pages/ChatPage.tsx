import { useState } from "react";
import { Send, RotateCcw, Bot } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { ChatBubble } from "../ui/ChatBubble";
import { TypingIndicator } from "../ui/TypingIndicator";
import { Suggestions } from "../ui/Suggestions";

export default function ChatPage() {
  const { messages, loading, send, reset, bottomRef } = useChat();
  const [input, setInput] = useState("");

  const handleSend = () => { send(input); setInput(""); };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center"><Bot size={18} className="text-emerald-400" /></div>
          <div>
            <p className="font-bold text-[15px]">GrafoMov IA</p>
            <p className="text-[11px] text-slate-500">Pregúntale sobre la movilidad de Bogotá</p>
          </div>
        </div>
        <button type="button" onClick={reset} className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 transition"><RotateCcw size={16} /></button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {!messages.length && <Suggestions onSelect={(q) => send(q)} />}
        {messages.map((m, i) => <ChatBubble key={`${m.role}-${i}-${m.content.slice(0, 20)}`} msg={m} />)}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <div className="px-6 py-4 border-t border-white/[0.04]">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribe tu pregunta..."
            className="flex-1 bg-slate-900 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition" />
          <button type="submit" disabled={loading}
            className="bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-40 rounded-xl px-4 py-3 text-white transition">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
