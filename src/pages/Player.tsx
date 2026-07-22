import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { TopBar } from "../components/Layout";
import { IconClose, IconChevronLeft, IconChevronRight } from "../components/Icons";
import { useStore, findExercise } from "../store";
import { dateKey } from "../lib/planning";
import type { HistoryEntry } from "../types";

type SessionStatus = "pending" | "done" | "skipped";
interface SessionItem {
  phaseId: string;
  phaseLabel: string;
  exerciseId: string;
  sets: number;
  restSeconds: number;
  status: SessionStatus;
}

function isVideo(path?: string): boolean {
  const ext = (path || "").split(".").pop()?.toLowerCase() || "";
  return ext === "mp4" || ext === "webm";
}

export function Player() {
  const { id } = useParams<{ id: string }>();
  const { data, update } = useStore();

  const workout = data.workouts.find((w) => w.id === id);

  const [session, setSession] = useState<SessionItem[]>([]);
  const [index, setIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);
  const [resting, setResting] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const generatedFor = useRef<string | null>(null);

  // Gera a lista sequencial: TODOS os exercícios de cada treino, por ordem,
  // um item por exercício (não só um escolhido ao acaso por treino).
  useEffect(() => {
    if (!workout || generatedFor.current === workout.id) return;
    generatedFor.current = workout.id;

    const items: SessionItem[] = [];
    for (const phase of workout.phases) {
      const validPool = (phase.pool || []).filter((exId) => data.exercises.some((e) => e.id === exId));
      for (const exerciseId of validPool) {
        items.push({
          phaseId: phase.id,
          phaseLabel: phase.label,
          exerciseId,
          sets: phase.sets || 1,
          restSeconds: phase.restSeconds || 60,
          status: "pending",
        });
      }
    }
    setSession(items);
    setIndex(0);
    setCurrentSet(0);
    setResting(false);
    setFinished(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout?.id]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const total = session.length;
  const slot = session[index];
  const ex = slot ? findExercise(data, slot.exerciseId) : undefined;
  const totalSets = slot?.sets || 1;

  const firstPendingFrom = useMemo(
    () => (fromIndex: number, list: SessionItem[]) => {
      for (let i = 0; i < list.length; i++) {
        const idx = (fromIndex + 1 + i) % list.length;
        if (list[idx].status === "pending") return idx;
      }
      return -1;
    },
    []
  );

  function finishSession() {
    if (!workout) return;
    const entry: HistoryEntry = {
      id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: dateKey(new Date()),
      workoutId: workout.id,
      workoutName: workout.name,
      category: workout.category,
      day: workout.day || null,
      person: data.settings.personName || "Eu",
    };
    const alreadyLogged = data.history.some((h) => h.date === entry.date && h.workoutId === workout.id);
    if (!alreadyLogged) update((d) => ({ ...d, history: [...d.history, entry] }));
    setFinished(true);
  }

  function jumpTo(i: number) {
    if (timerRef.current) clearInterval(timerRef.current);
    setResting(false);
    setIndex(i);
    setCurrentSet(0);
  }

  function startRest(restSeconds: number) {
    setResting(true);
    setSeconds(restSeconds);
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimeout(goNext, 0);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  function goNext() {
    if (timerRef.current) clearInterval(timerRef.current);
    setResting(false);
    if (currentSet < totalSets - 1) {
      setCurrentSet((s) => s + 1);
      return;
    }
    const updated = session.map((s, i) => (i === index ? { ...s, status: "done" as SessionStatus } : s));
    setSession(updated);
    const nextPending = firstPendingFrom(index, updated);
    if (nextPending === -1) {
      finishSession();
    } else {
      setIndex(nextPending);
      setCurrentSet(0);
    }
  }

  // Salta TODOS os exercícios restantes do treino atual e avança para o
  // primeiro exercício pendente do próximo treino.
  function skipTreino() {
    if (timerRef.current) clearInterval(timerRef.current);
    setResting(false);
    const currentPhaseId = slot.phaseId;
    const updated = session.map((s) => (s.phaseId === currentPhaseId ? { ...s, status: "skipped" as SessionStatus } : s));
    setSession(updated);
    const next = updated.findIndex((s, i) => i > index && s.status === "pending");
    if (next !== -1) {
      setIndex(next);
      setCurrentSet(0);
      return;
    }
    const anyPending = updated.findIndex((s) => s.status === "pending");
    if (anyPending !== -1) {
      setIndex(anyPending);
      setCurrentSet(0);
    } else {
      finishSession();
    }
  }

  function toggleStatus(i: number) {
    setSession((prev) => prev.map((s, idx) => (idx === i ? { ...s, status: s.status === "done" ? "pending" : "done" } : s)));
  }
  function skipItem(i: number) {
    setSession((prev) => prev.map((s, idx) => (idx === i ? { ...s, status: "skipped" } : s)));
  }

  if (!workout) return <p className="text-white/50">Categoria não encontrada.</p>;

  const emptyPhases = workout.phases.filter((p) => !session.some((s) => s.phaseId === p.id));
  let lastPhaseId: string | null = null;

  const ExerciseList = (
    <div className="card p-0 mb-4">
      {session.map((s, i) => {
        const isNewGroup = s.phaseId !== lastPhaseId;
        lastPhaseId = s.phaseId;
        const exObj = findExercise(data, s.exerciseId);
        const isCurrent = i === index && !finished;
        const glyph = s.status === "done" ? "✓" : s.status === "skipped" ? "–" : "○";
        const color = s.status === "done" ? "var(--color-accent)" : s.status === "skipped" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.75)";
        return (
          <div key={`${s.phaseId}-${s.exerciseId}-${i}`}>
            {isNewGroup && (
              <p className="text-white/30 text-[10px] tracking-wide uppercase px-4 pt-3 pb-1">{s.phaseLabel}</p>
            )}
            <div className={`flex items-center justify-between px-4 py-2.5 border-b border-white/10 last:border-b-0 transition-colors ${isCurrent ? "bg-white/[0.05]" : ""}`}>
              <div onClick={() => jumpTo(i)} className="flex items-center gap-2.5 flex-1 cursor-pointer">
                <span style={{ color }} className="text-sm w-4">{glyph}</span>
                <span className={`text-[13px] ${s.status === "skipped" ? "text-white/30 line-through" : "text-white"}`}>
                  {exObj?.name || "?"}
                </span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => toggleStatus(i)} className="text-white/40 hover:text-white/70 text-xs px-2 py-1.5 rounded-md">
                  {s.status === "done" ? "↺" : "✓"}
                </button>
                {s.status !== "skipped" && (
                  <button onClick={() => skipItem(i)} className="text-white/40 hover:text-white/70 text-xs px-2 py-1.5 rounded-md">–</button>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {emptyPhases.map((p) => (
        <div key={p.id}>
          <p className="text-white/30 text-[10px] tracking-wide uppercase px-4 pt-3 pb-1">{p.label}</p>
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 last:border-b-0 opacity-40">
            <span className="text-[13px]">—</span>
            <span className="text-[11px] text-white/30">sem exercícios</span>
          </div>
        </div>
      ))}
    </div>
  );

  if (!total) {
    return (
      <div>
        <TopBar label={workout.name} right={<a href="#/"><IconClose /></a>} />
        <p className="text-white/50 text-sm mb-5">
          Ainda não há exercícios em nenhum treino desta categoria. Adiciona pelo menos um em Gerir.
        </p>
        <p className="section-label mt-0">Exercícios desta categoria</p>
        {ExerciseList}
      </div>
    );
  }

  if (finished) {
    return (
      <div>
        <TopBar label={workout.name} right={<a href="#/"><IconClose /></a>} />
        <div className="text-center mt-10 mb-7">
          <p className="text-5xl mb-3">✓</p>
          <p className="text-white text-xl font-semibold mb-1.5">Categoria completa</p>
          <p className="text-white/50 text-sm mb-6">Registado no histórico de hoje.</p>
          <a href="#/" className="btn btn-accent inline-block px-6 leading-[48px] no-underline">Voltar ao início</a>
        </div>
        <p className="section-label mt-0">Resumo</p>
        {ExerciseList}
      </div>
    );
  }

  if (!ex) return <p className="text-white/50">Este treino não tem exercícios válidos. Edita a categoria em Gerir.</p>;

  if (resting) {
    const isLastSet = currentSet >= totalSets - 1;
    return (
      <div className="flex flex-col items-center pt-16">
        <div className="w-full">
          <TopBar label={workout.name} right={<a href="#/"><IconClose /></a>} />
        </div>
        <p className="text-white/40 text-xs tracking-[2px] uppercase mb-2">Descanso</p>
        <p className="text-[72px] leading-none font-bold tabular-nums mb-3" style={{ color: "var(--color-accent)" }}>{seconds}</p>
        {totalSets > 1 && (
          <p className="text-white/40 text-sm mb-8 text-center px-8">
            {isLastSet ? "Próximo exercício a seguir" : `Série ${currentSet + 2} de ${totalSets} · ${ex.name}`}
          </p>
        )}
        <div className="flex gap-2.5">
          <button className="btn w-auto px-5" onClick={() => setSeconds((s) => s + 30)}>+30s</button>
          <button className="btn btn-accent w-auto px-5" onClick={goNext}>Saltar descanso</button>
        </div>
      </div>
    );
  }

  const support = ex.secondaryMuscles?.length ? ex.secondaryMuscles.join(", ") : "—";

  return (
    <div>
      <div className="pb-28">
        <TopBar label={`${index + 1} de ${total}`} right={<a href="#/"><IconClose /></a>} />

        <div className="flex gap-1 mb-4">
          {session.map((s, i) => (
            <div
              key={`${s.phaseId}-${i}`}
              className="h-1 flex-1 rounded-full"
              style={{ background: i === index ? "var(--color-accent)" : s.status === "done" ? "rgba(201,255,61,0.35)" : "rgba(255,255,255,0.12)" }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold tracking-[1.5px] uppercase" style={{ color: "var(--color-accent)" }}>
            {slot.phaseLabel}{totalSets > 1 ? ` · Série ${currentSet + 1}/${totalSets}` : ""}
          </p>
          <button onClick={skipTreino} className="text-white/40 text-[11px] underline underline-offset-2">
            Saltar treino
          </button>
        </div>

        <div
          className="rounded-[28px] overflow-hidden mx-auto mb-5 border border-white/10"
          style={{ height: "min(480px, 50vh)", width: "auto", maxWidth: "100%", aspectRatio: "1402/1122", background: "linear-gradient(180deg,#1a1a18,#141412)" }}
        >
          {ex.gif ? (
            isVideo(ex.gif) ? (
              <video src={`${import.meta.env.BASE_URL}${ex.gif}`} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            ) : (
              <img src={`${import.meta.env.BASE_URL}${ex.gif}`} alt={ex.name} className="w-full h-full object-cover" />
            )
          ) : null}
        </div>

        <p className="text-2xl font-semibold mb-3">{ex.name}</p>
        <div className="card p-3.5 mb-4">
          <p className="text-white/60 text-[13px] mb-1.5"><strong className="text-white/85">Primary Muscle(s):</strong> {ex.primaryMuscle || "—"}</p>
          <p className="text-white/60 text-[13px] m-0"><strong className="text-white/85">Support Muscle(s):</strong> {support}</p>
        </div>
        {ex.notes && <p className="text-white/65 text-[13px] leading-relaxed mb-6">{ex.notes}</p>}

        <p className="section-label mt-0">Exercícios desta categoria</p>
        {ExerciseList}
        <button
          className="btn w-full mb-2 text-white/50"
          onClick={() => confirm("Terminar a sessão agora e registar no histórico?") && finishSession()}
        >
          Terminar sessão agora
        </button>
      </div>

      <div className="fixed left-0 right-0 bottom-20 md:bottom-6 max-w-[420px] md:max-w-[480px] mx-auto px-5 flex gap-2.5 z-30">
        <button
          className="btn w-14 flex items-center justify-center shrink-0"
          disabled={index === 0}
          style={index === 0 ? { opacity: 0.3 } : {}}
          onClick={() => jumpTo(Math.max(index - 1, 0))}
        >
          <IconChevronLeft />
        </button>
        <button className="btn btn-accent flex-1" onClick={() => startRest(slot.restSeconds || 60)}>
          {totalSets > 1 && currentSet < totalSets - 1 ? "Completar série" : "Completar exercício"}
        </button>
        <button
          className="btn w-14 flex items-center justify-center shrink-0"
          disabled={index === total - 1}
          style={index === total - 1 ? { opacity: 0.3 } : {}}
          onClick={() => jumpTo(Math.min(index + 1, total - 1))}
        >
          <IconChevronRight />
        </button>
      </div>
    </div>
  );
}
