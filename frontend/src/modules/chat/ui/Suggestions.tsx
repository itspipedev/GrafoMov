import { Bot } from "lucide-react";

type Props = Readonly<{ onSelect: (query: string) => void }>;

const SUGGESTIONS = [
  "¿Zonas más peligrosas?",
  "¿Paraderos cerca del centro?",
  "¿Nodo más central de la red?",
];

export function Suggestions({ onSelect }: Props) {
  return (
    <div className="text-center text-slate-500 mt-20">
      <Bot size={40} className="mx-auto mb-4 text-slate-600" />
      <p className="text-lg font-semibold mb-2">¿Qué quieres saber?</p>
      <p className="text-sm mb-6 text-slate-500">Pregunta sobre estaciones, rutas, zonas peligrosas o accesibilidad</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {SUGGESTIONS.map((q) => (
          <button type="button" key={q} onClick={() => onSelect(q)}
            className="text-xs px-4 py-2 rounded-xl border border-white/[0.08] bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 transition">
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
