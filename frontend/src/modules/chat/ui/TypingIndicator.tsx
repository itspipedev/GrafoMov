import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-2.5 mb-4">
      <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center"><Bot size={14} className="text-emerald-400 animate-pulse" /></div>
      <div className="bg-slate-800 rounded-2xl px-4 py-3 flex gap-1.5">
        {[0, 1, 2].map((i) => <div key={i} className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />)}
      </div>
    </div>
  );
}
