import { useState } from "react";
import { useNavigate, useParams, useBeforeUnload } from "react-router-dom";
import { TopBar } from "../components/Layout";
import { IconClose } from "../components/Icons";
import { useStore, findExercise } from "../store";
import type { Categoria, Treino, Category } from "../types";

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function Builder() {
  const { idOrCat } = useParams<{ idOrCat: string }>();
  const { data, setWorkouts } = useStore();
  const nav = useNavigate();

  const existing = data.workouts.find((w) => w.id === idOrCat);
  const [draft, setDraft] = useState<Categoria>(
    () =>
      existing || {
        id: uid("wo"),
        name: "Nova categoria",
        day: "",
        category: (idOrCat as Category) || "custom",
        phases: [],
      }
  );
  const [dirty, setDirty] = useState(false);

  useBeforeUnload((e) => {
    if (dirty) e.preventDefault();
  });

  function guardedNav(to: string) {
    if (dirty && !confirm("Tens alterações por guardar nesta categoria. Sair sem guardar e perder essas alterações?")) return;
    nav(to);
  }

  function patch(p: Partial<Categoria>) {
    setDraft((d) => ({ ...d, ...p }));
    setDirty(true);
  }
  function patchTreino(idx: number, p: Partial<Treino>) {
    setDraft((d) => ({ ...d, phases: d.phases.map((t, i) => (i === idx ? { ...t, ...p } : t)) }));
    setDirty(true);
  }
  function addTreino() {
    patch({ phases: [...draft.phases, { id: uid("tr"), label: "Novo treino", sets: 3, restSeconds: 60, pool: [] }] });
  }
  function removeTreino(idx: number) {
    patch({ phases: draft.phases.filter((_, i) => i !== idx) });
  }
  function moveTreino(idx: number, dir: number) {
    const phases = [...draft.phases];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= phases.length) return;
    [phases[idx], phases[newIdx]] = [phases[newIdx], phases[idx]];
    patch({ phases });
  }
  function addToPool(idx: number, exId: string) {
    const t = draft.phases[idx];
    patchTreino(idx, { pool: [...(t.pool || []), exId] });
  }
  function removeFromPool(idx: number, exId: string) {
    const t = draft.phases[idx];
    patchTreino(idx, { pool: (t.pool || []).filter((id) => id !== exId) });
  }

  function save() {
    const clean: Categoria = {
      ...draft,
      phases: draft.phases.map((p) => ({ ...p, pool: (p.pool || []).filter((exId) => findExercise(data, exId)) })),
    };
    const exists = data.workouts.some((w) => w.id === clean.id);
    setWorkouts(exists ? data.workouts.map((w) => (w.id === clean.id ? clean : w)) : [...data.workouts, clean]);
    setDirty(false);
    nav("/gerir");
  }

  const alreadySaved = data.workouts.some((w) => w.id === draft.id);

  return (
    <div>
      <TopBar
        label="Editar categoria"
        right={
          <button onClick={() => guardedNav("/gerir")} className="bg-transparent border-none text-white">
            <IconClose />
          </button>
        }
      />

      <p className="text-xs font-semibold tracking-wide mb-1.5" style={{ color: "var(--color-accent)" }}>
        {alreadySaved ? `A EDITAR "${existing?.name}"${existing?.day ? ` · DIA ${existing.day.toUpperCase()}` : ""} (${existing?.phases.length} treinos guardados)` : "NOVA CATEGORIA — AINDA NÃO GUARDADA"}
      </p>
      {dirty ? (
        <div className="rounded-xl px-3.5 py-2.5 mb-4" style={{ background: "rgba(255,107,107,0.12)", border: "1px solid rgba(255,107,107,0.4)" }}>
          <p className="text-[#ff8a8a] text-xs font-semibold m-0">⚠ Tens alterações por guardar — toca em "Guardar categoria" no fundo antes de saíres.</p>
        </div>
      ) : (
        <p className="text-white/30 text-[11px] mb-4">Tudo guardado.</p>
      )}

      <label className="text-xs text-white/50 block mb-1.5">Nome da categoria</label>
      <input className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-sm mb-3.5" value={draft.name} onChange={(e) => patch({ name: e.target.value })} />
      <label className="text-xs text-white/50 block mb-1.5">Etiqueta do dia (opcional, ex: "A")</label>
      <input className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-sm mb-4" value={draft.day || ""} onChange={(e) => patch({ day: e.target.value })} />

      <p className="section-label mt-0">Treinos (roda automaticamente se tiveres mais que uma opção por treino)</p>
      <div className="card p-0 mb-3.5">
        {draft.phases.length === 0 && <p className="text-white/30 text-sm p-4">Sem treinos ainda.</p>}
        {draft.phases.map((t, idx) => {
          const pool = t.pool || [];
          const addable = data.exercises.filter((ex) => !pool.includes(ex.id));
          return (
            <div key={t.id} className="p-3.5 border-b border-white/10 last:border-b-0">
              <div className="flex items-center gap-2 mb-2.5">
                <input className="flex-1 h-10 rounded-lg bg-white/5 border border-white/10 px-2.5 text-sm font-semibold" value={t.label} onChange={(e) => patchTreino(idx, { label: e.target.value })} />
                <button className="text-white/40" onClick={() => moveTreino(idx, -1)}>↑</button>
                <button className="text-white/40" onClick={() => moveTreino(idx, 1)}>↓</button>
                <button className="text-[#ff6b6b]" onClick={() => removeTreino(idx)}>×</button>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-white/30 text-[11px]">Séries</span>
                  <button className="w-6 h-6 rounded-lg bg-white/5 border border-white/10" onClick={() => patchTreino(idx, { sets: Math.max(1, (t.sets || 1) - 1) })}>−</button>
                  <span className="text-sm w-3 text-center">{t.sets || 1}</span>
                  <button className="w-6 h-6 rounded-lg bg-white/5 border border-white/10" onClick={() => patchTreino(idx, { sets: (t.sets || 1) + 1 })}>+</button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/30 text-[11px]">Descanso</span>
                  <button className="w-6 h-6 rounded-lg bg-white/5 border border-white/10" onClick={() => patchTreino(idx, { restSeconds: Math.max(0, (t.restSeconds || 60) - 15) })}>−</button>
                  <span className="text-sm w-8 text-center">{t.restSeconds || 60}s</span>
                  <button className="w-6 h-6 rounded-lg bg-white/5 border border-white/10" onClick={() => patchTreino(idx, { restSeconds: (t.restSeconds || 60) + 15 })}>+</button>
                </div>
              </div>
              <p className="text-white/30 text-[11px] mb-2">Opções deste treino {pool.length > 1 ? "(roda entre elas a cada sessão)" : ""}</p>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {pool.length === 0 && <span className="text-white/30 text-xs">Nenhuma ainda.</span>}
                {pool.map((exId) => {
                  const ex = findExercise(data, exId);
                  return (
                    <span key={exId} className={`inline-flex items-center gap-1.5 rounded-full pl-3 pr-1.5 py-1 text-xs ${ex ? "bg-white/5 border border-white/10" : "border"}`} style={!ex ? { background: "rgba(255,107,107,0.12)", borderColor: "rgba(255,107,107,0.4)", color: "#ff8a8a" } : {}}>
                      {ex ? ex.name : "⚠ exercício apagado — remove"}
                      <button className="text-[#ff6b6b]" onClick={() => removeFromPool(idx, exId)}>×</button>
                    </span>
                  );
                })}
              </div>
              {addable.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {addable.map((ex) => (
                    <button key={ex.id} className="btn h-[30px] px-2.5 text-[11px] w-auto" onClick={() => addToPool(idx, ex.id)}>+ {ex.name}</button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button className="btn w-full mb-6" onClick={addTreino}>+ Novo treino</button>

      <button className="btn btn-accent w-full" onClick={save}>Guardar categoria</button>

      {alreadySaved && (
        <div className="mt-2.5">
          <button
            className="btn btn-danger w-full"
            onClick={() => {
              if (!confirm("Apagar esta categoria? Não é possível desfazer.")) return;
              setWorkouts(data.workouts.filter((w) => w.id !== draft.id));
              nav("/gerir");
            }}
          >
            Apagar categoria
          </button>
        </div>
      )}
    </div>
  );
}
