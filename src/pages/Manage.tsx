import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { TopBar } from "../components/Layout";
import { IconClose } from "../components/Icons";
import { useStore } from "../store";
import type { Category, Exercise, Difficulty } from "../types";

const CATEGORY_ORDER: Category[] = ["strength", "yoga", "mobility", "custom"];
const CATEGORY_LABELS: Record<Category, string> = {
  strength: "Força",
  yoga: "Yoga",
  mobility: "Mobilidade",
  custom: "Personalizado",
};

function ExerciseForm({ initial, onSave, onCancel }: { initial?: Exercise; onSave: (e: Exercise) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Exercise>(
    initial || {
      id: `ex-${Date.now()}`,
      name: "",
      category: "strength",
      primaryMuscle: "",
      secondaryMuscles: [],
      difficulty: "beginner",
      notes: "",
      gif: "",
      thumbnail: "",
    }
  );
  return (
    <div className="card p-4 mt-4">
      <label className="text-xs text-white/50 block mb-1.5">Nome</label>
      <input className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-sm mb-3.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <div className="grid grid-cols-2 gap-3 mb-3.5">
        <div>
          <label className="text-xs text-white/50 block mb-1.5">Categoria</label>
          <select className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
            {CATEGORY_ORDER.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-white/50 block mb-1.5">Dificuldade</label>
          <select className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-sm" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as Difficulty })}>
            {(["beginner", "intermediate", "advanced"] as Difficulty[]).map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>
      <label className="text-xs text-white/50 block mb-1.5">Músculo primário</label>
      <input className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-sm mb-3.5" value={form.primaryMuscle} onChange={(e) => setForm({ ...form, primaryMuscle: e.target.value })} />
      <label className="text-xs text-white/50 block mb-1.5">Músculos secundários (vírgula)</label>
      <input className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-sm mb-3.5" value={form.secondaryMuscles.join(", ")} onChange={(e) => setForm({ ...form, secondaryMuscles: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
      <label className="text-xs text-white/50 block mb-1.5">Notas</label>
      <textarea className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm mb-3.5" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      <label className="text-xs text-white/50 block mb-1.5">Caminho do GIF/vídeo (em assets/exercises/)</label>
      <input className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-sm mb-3.5" placeholder="assets/exercises/nome.png" value={form.gif} onChange={(e) => setForm({ ...form, gif: e.target.value })} />
      <div className="flex gap-2">
        <button className="btn flex-1" onClick={onCancel}>Cancelar</button>
        <button className="btn btn-accent flex-1" onClick={() => onSave(form)}>Guardar</button>
      </div>
    </div>
  );
}

export function Manage() {
  const { data, setExercises, setWorkouts } = useStore();
  const nav = useNavigate();
  const [editingEx, setEditingEx] = useState<Exercise | "new" | null>(null);

  const byCategory: Record<string, typeof data.workouts> = {};
  data.workouts.forEach((w) => {
    byCategory[w.category] = byCategory[w.category] || [];
    byCategory[w.category].push(w);
  });

  function saveExercise(ex: Exercise) {
    const exists = data.exercises.some((e) => e.id === ex.id);
    setExercises(exists ? data.exercises.map((e) => (e.id === ex.id ? ex : e)) : [...data.exercises, ex]);
    setEditingEx(null);
  }
  function removeExercise(id: string) {
    setExercises(data.exercises.filter((e) => e.id !== id));
  }
  function removeWorkout(id: string) {
    if (!confirm("Apagar esta categoria? Não é possível desfazer.")) return;
    setWorkouts(data.workouts.filter((w) => w.id !== id));
  }

  return (
    <div>
      <TopBar label="Gerir" right={<a href="#/"><IconClose /></a>} />

      <p className="section-label mt-0">Categorias</p>
      {CATEGORY_ORDER.map((cat) => {
        const list = byCategory[cat] || [];
        return (
          <div key={cat} className="card p-0 mb-3">
            <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
              <span className="text-white/30 text-[11px] tracking-wide uppercase">{CATEGORY_LABELS[cat]}</span>
              <button className="text-[var(--color-accent)] text-xs font-semibold" onClick={() => nav(`/editar/${cat}`)}>+ Novo</button>
            </div>
            {list.length ? (
              list.map((w) => (
                <div key={w.id} className="flex items-center justify-between px-4 h-14 border-b border-white/10 last:border-b-0">
                  <div>
                    <span className="text-sm">{w.name}</span>
                    {w.day && <span className="text-white/30 text-[11px] ml-2">{w.day}</span>}
                    <span className="text-white/30 text-[11px] ml-2">{w.phases.length} treinos</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="btn h-8 px-2.5 text-xs w-auto" onClick={() => nav(`/editar/${w.id}`)}>Editar</button>
                    <button className="btn btn-danger h-8 px-2.5 text-xs w-auto" onClick={() => removeWorkout(w.id)}>Apagar</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/30 text-xs px-4 py-3.5">Sem categorias ainda.</p>
            )}
          </div>
        );
      })}

      <p className="section-label">Exercícios</p>
      <div className="card p-0 mb-4">
        {data.exercises.map((ex) => (
          <div key={ex.id} className="flex items-center justify-between px-4 h-14 border-b border-white/10 last:border-b-0">
            <div>
              <p className="text-sm m-0">{ex.name}</p>
              <p className="text-white/30 text-[11px] m-0">{ex.primaryMuscle}</p>
            </div>
            <div className="flex gap-1.5">
              <button className="btn h-8 px-2.5 text-xs w-auto" onClick={() => setEditingEx(ex)}>Editar</button>
              <button className="btn btn-danger h-8 px-2.5 text-xs w-auto" onClick={() => removeExercise(ex.id)}>Apagar</button>
            </div>
          </div>
        ))}
      </div>
      <button className="btn w-full" onClick={() => setEditingEx("new")}>+ Novo exercício</button>

      {editingEx && (
        <ExerciseForm
          initial={editingEx === "new" ? undefined : editingEx}
          onSave={saveExercise}
          onCancel={() => setEditingEx(null)}
        />
      )}
    </div>
  );
}
