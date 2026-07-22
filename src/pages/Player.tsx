import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { TopBar } from "../components/Layout";
import { IconClose, IconChevronLeft, IconChevronRight } from "../components/Icons";
import { useStore, findExercise } from "../store";
import { pickForTreino } from "../lib/rotation";
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

  useEffect(() => {
    if (!workout || generatedFor.current === workout.id) return;
    generatedFor.current = workout.id;

    let rotation = data.phaseRotation;
    const items: SessionItem[] = [];
    for (const phase of workout.phases) {
      const exerciseId = pickForTreino(data, workout.id, phase, rotation, (next) => {
        rotation = next;
      });
      if (!exerciseId) continue;
      items.push({
        phaseId: phase.id,
        phaseLabel: phase.label,
        exerciseId,
        sets: phase.sets || 1,
        restSeconds: phase.restSeconds || 60,
        status: "pending",
      });
    }
    setSession(items);
    setIndex(0);
    setCurrentSet(0);
    setResting(false);
    setFinished(false);
    update((d) => ({ ...d, phaseRotation: rotation }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout?.id]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const total = session.length;
  const slot = session[index];
  const ex = slot ? findExercise(data, slot.exerciseId) : undefined;
  const totalSets = slot?.sets || 1;

  const firstPendingIndex = useMemo(
    () => (fromIndex: number) => {
      for (let i = 0; i < session.length; i++) {
        const idx = (fromIndex + 1 + i) % session.length;
        if (session[idx].status === "pending") return idx;
      }
      return -1;
    },
    [session]
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

  function goNext() {
    if (timerRef.current) clearInterval(timerRef.current);
    setResting(false);
    if (currentSet < totalSets - 1) {
      setCurrentSet((s) => s + 1);
      return;
    }
    setSession((prev) => prev.map((s, i) => (i === index ? { ...s, status: "done" } : s)));
    const nextPending = firstPendingIndex(index);
    if (nextPending === -1) {
      finishSession();
    } else {
      setIndex(nextPending);
      setCurrentSet(0);
    }
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

  function toggleStatus(i: number) {
    setSession((prev) => prev.map((s, idx) => (idx === i ? { ...s, status: s.status === "done" ? "pending" : "done" } : s)));
  }
  function skipItem(i: number) {
    setSession((prev) => prev.map((s, idx) => (idx === i ? { ...s, status: "skipped" } : s)));
  }

  if (!workout) return <p className="text-white/50">Categoria não encontrada.</p>;
  if (!total) return <p className="text-white/50">Esta categoria ainda não tem treinos com exercícios. Edita-a em Gerir.</p>;

  const SessionSidebar = (
    <div className="card p-0 mb-4">
      {session.map((s, i) => {
        const isCurrent = i === index && !finished;
        const icon = s.status === "done" ? "✓" : s.status === "skipped" ? "–" : "○";
        const color = s.status === "done" ? "var(--color-accent)" : s.status === "skipped" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.7)";
        return (
          <div key={s.phaseId} className={`flex items-center justify-between px-3.5 py-2.5 border-b border-white/10 last:border-b-0 ${isCurrent ? "bg-white/[0.04]" : ""}`}>
            <div onClick={() => jumpTo(i)} className="flex items-center gap-2.5 flex-1 cursor-pointer">
              <span style={{ color }} className="text-sm w-4">{icon}</span>
              <span className={`text-[13px] ${s.status === "skipped" ? "text-white/30 line-through" : "text-white"}`}>{s.phaseLabel}</span>
            </div>
            <div className="flex gap-1">
              <button onClick={() => toggleStatus(i)} className="text-white/30 text-xs px-1.5 py-1">{s.status === "done" ? "↺" : "✓"}</button>
              {s.status !== "skipped" && <button onClick={() => skipItem(i)} className="text-white/30 text-xs px-1.5 py-1">–</button>}
            </div>
          </div>
        );
      })}
    </div>
  );

  if (finished) {
    return (
      <div>
        <TopBar label={workout.name} right={<a href="#/"><IconClose /></a>} />
        <div className="text-center mt-10 mb-6">
          <p className="text-4xl mb-3">✓</p>
          <p className="text-white text-lg font-semibold mb-1.5">Categoria completa</p>
          <p className="text-white/50 text-[13px] mb-5">Registado no histórico de hoje.</p>
          <a href="#/" className="btn btn-accent inline-block px-5 leading-[48px] no-underline">Voltar ao início</a>
        </div>
        <p className="section-label mt-0">Resumo</p>
        {SessionSidebar}
      </div>
    );
  }

  if (!ex) return <p className="text-white/50">Este treino não tem exercícios válidos. Edita a categoria em Gerir.</p>;

  if (resting) {
    const isLastSet = currentSet >= totalSets - 1;
    return (
      <div>
        <TopBar label={workout.name} right={<a href="#/"><IconClose /></a>} />
        <p className="text-white/50 text-[13px] text-center mt-10">Descanso</p>
        {totalSets > 1 && (
          <p className="text-white/30 text-xs text-center">
            {isLastSet ? "Próximo treino a seguir" : `Série ${currentSet + 2} / ${totalSets} de ${ex.name}`}
          </p>
        )}
        <p className="text-[56px] font-semibold text-center tabular-nums my-2">{seconds}</p>
        <div className="flex gap-2 justify-center">
          <button className="btn w-auto px-4" onClick={() => setSeconds((s) => s + 30)}>+30s</button>
          <button className="btn w-auto px-4" onClick={goNext}>Saltar descanso</button>
        </div>
      </div>
    );
  }

  const support = ex.secondaryMuscles?.length ? ex.secondaryMuscles.join(", ") : "—";

  return (
    <div>
      <div className="pb-24">
        <TopBar label={`${index + 1} / ${total}`} right={<a href="#/"><IconClose /></a>} />
        <p className="text-xs font-bold tracking-wider uppercase mb-2" style={{ color: "var(--color-accent)" }}>
          {slot.phaseLabel}{totalSets > 1 ? ` · Série ${currentSet + 1}/${totalSets}` : ""}
        </p>

        <div className="w-full rounded-[28px] overflow-hidden mx-auto mb-4" style={{ height: "min(500px, 54vh)", aspectRatio: "1402/1122", background: "linear-gradient(180deg,#1a1a18,#141412)" }}>
          {ex.gif ? (
            isVideo(ex.gif) ? (
              <video src={`${import.meta.env.BASE_URL}${ex.gif}`} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            ) : (
              <img src={`${import.meta.env.BASE_URL}${ex.gif}`} alt={ex.name} className="w-full h-full object-cover" />
            )
          ) : null}
        </div>

        <p className="text-[22px] font-semibold mb-2">{ex.name}</p>
        <p className="text-white/50 text-[13px] mb-1"><strong className="text-white/80">Primary Muscle(s):</strong> {ex.primaryMuscle || "—"}</p>
        <p className="text-white/50 text-[13px] mb-2.5"><strong className="text-white/80">Support Muscle(s):</strong> {support}</p>
        {ex.notes && <p className="text-white/65 text-[13px] leading-relaxed mb-5">{ex.notes}</p>}

        <p className="section-label mt-0">Treinos desta categoria</p>
        {SessionSidebar}
        <button className="btn w-full mb-2" onClick={() => confirm("Terminar a sessão agora e registar no histórico?") && finishSession()}>
          Terminar sessão agora
        </button>
      </div>

      <div className="fixed left-0 right-0 bottom-20 md:bottom-6 max-w-[420px] md:max-w-[480px] mx-auto px-5 flex gap-2 z-30">
        <button className="btn flex-1" disabled={index === 0} style={index === 0 ? { opacity: 0.3 } : {}} onClick={() => jumpTo(Math.max(index - 1, 0))}>
          <IconChevronLeft className="mx-auto" />
        </button>
        <button className="btn btn-accent flex-[2]" onClick={() => startRest(slot.restSeconds || 60)}>
          {totalSets > 1 && currentSet < totalSets - 1 ? "Completar série" : "Completar treino"}
        </button>
        <button className="btn flex-1" disabled={index === total - 1} style={index === total - 1 ? { opacity: 0.3 } : {}} onClick={() => jumpTo(Math.min(index + 1, total - 1))}>
          <IconChevronRight className="mx-auto" />
        </button>
      </div>
    </div>
  );
}
