import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar } from "../components/Layout";
import { IconClose, IconChevronLeft, IconChevronRight } from "../components/Icons";
import { useStore } from "../store";
import { dateKey, letterForDate, historyEntryFor, workoutForLetter, WEEKDAY_SHORT } from "../lib/planning";

export function Plan() {
  const { data } = useStore();
  const nav = useNavigate();
  const [monthOffset, setMonthOffset] = useState(0);

  const base = new Date();
  base.setDate(1);
  base.setMonth(base.getMonth() + monthOffset);
  const year = base.getFullYear();
  const month = base.getMonth();
  const monthLabel = base.toLocaleDateString("pt-PT", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = dateKey(new Date());

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(<div key={`e${i}`} />);
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const key = dateKey(d);
    const letter = letterForDate(data, d);
    const workout = letter !== "rest" ? workoutForLetter(data, letter) : undefined;
    const done = workout ? !!historyEntryFor(data, key, workout.id) : false;
    const isToday = key === todayKey;

    cells.push(
      <div
        key={key}
        onClick={() => workout && nav(`/jogar/${workout.id}`)}
        className="aspect-square rounded-[10px] flex flex-col items-center justify-center gap-0.5"
        style={{
          background: isToday ? "rgba(255,255,255,0.04)" : "transparent",
          border: isToday ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
          cursor: workout ? "pointer" : "default",
        }}
      >
        <span className="text-xs" style={{ color: isToday ? "#fff" : "rgba(255,255,255,0.5)" }}>{day}</span>
        {letter !== "rest" ? (
          <span className="text-[10px] font-semibold" style={{ color: done ? "var(--color-accent)" : "rgba(255,255,255,0.3)" }}>{letter}</span>
        ) : (
          <span className="text-[10px] opacity-40 text-white/30">·</span>
        )}
      </div>
    );
  }

  return (
    <div>
      <TopBar label="Plano" right={<a href="#/"><IconClose /></a>} />
      <div className="flex items-center justify-between mb-4">
        <button className="text-white/50" onClick={() => setMonthOffset((m) => m - 1)}><IconChevronLeft /></button>
        <span className="text-sm font-semibold capitalize">{monthLabel}</span>
        <button className="text-white/50" onClick={() => setMonthOffset((m) => m + 1)}><IconChevronRight /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAY_SHORT.map((w) => <span key={w} className="text-[10px] text-white/30 text-center">{w[0]}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1 mb-5">{cells}</div>
      <button className="btn w-full mb-2" onClick={() => nav("/historico")}>Ver histórico</button>
      <button className="btn w-full" onClick={() => nav("/admin")}>Editar plano semanal</button>
    </div>
  );
}
