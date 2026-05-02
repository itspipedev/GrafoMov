import { Bot, User } from "lucide-react";
import type { ChatMessage } from "../../../shared/types";

type Props = Readonly<{ msg: ChatMessage }>;

export function ChatBubble({ msg }: Props) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-2.5 mb-4 ${isUser ? "justify-end" : ""}`}>
      {!isUser && <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0"><Bot size={14} className="text-emerald-400" /></div>}
      <div className={`max-w-[65%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${isUser ? "bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-[18px_18px_4px_18px]" : "bg-gradient-to-br from-slate-800 to-slate-800/80 border border-white/[0.04] rounded-[18px_18px_18px_4px] text-slate-200"}`}>
        {msg.content}
      </div>
      {isUser && <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0"><User size={14} className="text-slate-300" /></div>}
    </div>
  );
}
