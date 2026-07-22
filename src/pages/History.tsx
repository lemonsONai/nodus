import { useRef } from "react";
import { TopBar } from "../components/Layout";
import { IconClose } from "../components/Icons";
import { useStore } from "../store";
import type { HistoryEntry } from "../types";

export function History() {
  const { data, update } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const sorted = [...data.history].sort((a, b) => (a.date < b.date ? 1 : -1));
  const now = new Date();
  const thisMonthKey = now.toISOString().slice(0, 7);
  const thisMonth = sorted.filter((h) => h.date.slice(0, 7) === thisMonthKey);
  const people = [...new Set(thisMonth.map((h) => h.person || "Eu"))];

  const byMonth: Record<string, HistoryEntry[]> = {};
  sorted.forEach((h) => {
    const m = h.date.slice(0, 7);
    byMonth[m] = byMonth[m] || [];
    byMonth[m].push(h);
  });
  const months = Object.keys(byMonth).sort().reverse();

  function exportHistory() {
    const blob = new Blob([JSON.stringify(data.history, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "history.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importHistory(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const incoming = JSON.parse(reader.result as string) as HistoryEntry[];
        const seen = new Set(data.history.map((h) => h.date + ":" + h.workoutId));
        const merged = [...data.history];
        incoming.forEach((h) => {
          const sig = h.date + ":" + h.workoutId;
          if (!seen.has(sig)) { merged.push(h); seen.add(sig); }
        });
        update((d) => ({ ...d, history: merged }));
      } catch {
        alert("Ficheiro inválido.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div>
      <TopBar label="Histórico" right={<a href="#/plano"><IconClose /></a>} />

      <p className="section-label mt-0">Este mês</p>
      <div className="card p-4 mb-5">
        {people.length ? people.map((p) => {
          const mine = thisMonth.filter((h) => (h.person || "Eu") === p);
          const s = mine.filter((h) => h.category === "strength").length;
          const y = mine.filter((h) => h.category === "yoga").length;
          return (
            <div key={p} className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0">
              <span className="text-sm">{p}</span>
              <span className="text-xs text-white/50">{s} força · {y} yoga</span>
            </div>
          );
        }) : <p className="text-white/50 text-sm">Ainda sem sessões este mês.</p>}
      </div>

      <div className="card p-4 mb-5">
        <p className="text-sm font-semibold mb-2">Consolidar entre dispositivos</p>
        <p className="text-white/50 text-xs leading-relaxed mb-3">
          Exporta e importa noutro dispositivo — a fusão evita duplicados automaticamente.
        </p>
        <div className="flex gap-2">
          <button className="btn flex-1" onClick={exportHistory}>Exportar</button>
          <button className="btn flex-1" onClick={() => fileRef.current?.click()}>Importar</button>
        </div>
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importHistory(e.target.files[0])} />
      </div>

      {months.length ? months.map((m) => (
        <div key={m}>
          <p className="section-label">{new Date(m + "-01").toLocaleDateString("pt-PT", { month: "long", year: "numeric" })}</p>
          <div className="card p-0 mb-4">
            {byMonth[m].map((h) => (
              <div key={h.id} className="flex justify-between px-4 h-14 items-center border-b border-white/10 last:border-b-0">
                <div>
                  <span className="text-sm">{h.workoutName}{h.day ? " · " + h.day : ""}</span>
                  <span className="text-white/30 text-[11px] ml-2">{h.person || "Eu"}</span>
                </div>
                <span className="text-white/30 text-xs">{new Date(h.date).toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" })}</span>
              </div>
            ))}
          </div>
        </div>
      )) : <p className="text-white/50 text-sm">Ainda sem sessões registadas.</p>}
    </div>
  );
}
