import { useNavigate, useParams } from "react-router-dom";
import { TopBar } from "../components/Layout";
import { IconClose, IconEdit, IconPlus } from "../components/Icons";
import { useStore } from "../store";
import { dateKey, letterForDate, historyEntryFor, WEEKDAY_SHORT } from "../lib/planning";
import type { Category } from "../types";

const CATEGORY_LABELS: Record<Category, string> = {
  strength: "Força",
  yoga: "Yoga",
  mobility: "Mobilidade",
  custom: "Personalizado",
};

function WeekStrip() {
  const { data } = useStore();
  const nav = useNavigate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rows = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const letter = letterForDate(data, d);
    const workout = letter !== "rest" ? data.workouts.find((w) => w.day === letter) : undefined;
    const key = dateKey(d);
    const done = workout ? !!historyEntryFor(data, key, workout.id) : false;
    const isToday = i === 0;

    rows.push(
      <div
        key={key}
        onClick={() => workout && nav(`/jogar/${workout.id}`)}
        className={`flex items-center justify-between px-4 h-[52px] border-b border-white/[0.06] last:border-b-0 ${workout ? "cursor-pointer" : ""}`}
      >
        <div>
          <span className={`text-sm ${isToday ? "font-semibold" : ""}`}>{WEEKDAY_SHORT[d.getDay()]}</span>
          <span className="text-white/30 text-[11px] ml-2">{d.getDate()}/{d.getMonth() + 1}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${letter === "rest" ? "text-white/30" : "text-white/60"}`}>
            {letter === "rest" ? "Descanso" : workout ? workout.name : "Categoria " + letter}
          </span>
          {workout && <span className={done ? "text-[var(--color-accent)]" : "text-white/20"}>✓</span>}
        </div>
      </div>
    );
  }
  return <div className="card p-0 mb-5">{rows}</div>;
}

export function CategoryList() {
  const { cat } = useParams<{ cat: string }>();
  const category = (cat || "strength") as Category;
  const { data } = useStore();
  const nav = useNavigate();

  const label = CATEGORY_LABELS[category] || category;
  const days = data.workouts.filter((w) => w.category === category);
  const quote = data.quotes[category as "strength" | "yoga"];
  const todayLetter = letterForDate(data, new Date());
  const isStrength = category === "strength";

  const heroClass = isStrength
    ? "bg-gradient-to-br from-[#1c1e22] to-[#0a0a09]"
    : "bg-gradient-to-br from-[#322a1e] to-[#0f0d0a]";

  return (
    <div>
      <TopBar right={<a href="#/"><IconClose /></a>} />

      <div className={`rounded-[24px] p-5 mb-5 relative overflow-hidden ${heroClass}`}>
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-20" style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }} />
        <div className="relative flex justify-between items-start gap-4 flex-wrap">
          <div className="min-w-[140px]">
            <p className="text-white/50 text-xs tracking-[2px] mb-1">NODUS</p>
            <h1 className="text-white text-2xl font-semibold">{label}</h1>
          </div>
          {quote && (
            <div className="flex-1 min-w-[170px] max-w-[240px] border-l-2 pl-3.5" style={{ borderColor: "var(--color-accent)" }}>
              <p className="text-white/85 text-[13px] italic leading-relaxed">"{quote.text}"</p>
              {quote.author && <p className="text-white/30 text-[11px] mt-2">— {quote.author}</p>}
            </div>
          )}
        </div>
      </div>

      {isStrength && (
        <>
          <p className="section-label mt-0">Esta semana</p>
          <WeekStrip />
        </>
      )}

      <p className="section-label mt-0">Que categoria queres treinar?</p>
      <p className="text-white/30 text-[11px] -mt-1.5 mb-3">
        Todos os que criares aparecem aqui. A letra do dia é só para a rotação semanal (opcional).
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mb-5">
        {days.map((w) => {
          const isToday = !!w.day && w.day === todayLetter;
          return (
            <div
              key={w.id}
              onClick={() => nav(`/jogar/${w.id}`)}
              className={`rounded-2xl p-4 min-h-[92px] relative cursor-pointer border ${
                isToday ? "border-[var(--color-accent)]" : "border-white/10"
              }`}
              style={isToday ? { background: "linear-gradient(160deg, #1c1e22, #0a0a09)" } : { background: "#111" }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nav(`/editar/${w.id}`);
                }}
                className="absolute top-2.5 left-2.5 w-[26px] h-[26px] rounded-lg bg-white/[0.08] flex items-center justify-center text-white/70"
              >
                <IconEdit />
              </button>
              {isToday && <span className="absolute top-2.5 right-3 text-[10px] font-semibold tracking-wide" style={{ color: "var(--color-accent)" }}>HOJE</span>}
              <p className="text-white/30 text-[11px] mt-[22px] mb-1.5">{w.day ? `Categoria ${w.day}` : "Sem dia atribuído"}</p>
              <p className="text-white text-[15px] font-semibold mb-1">{w.name}</p>
              <p className="text-white/30 text-[11px]">{w.phases.length} treinos</p>
            </div>
          );
        })}
        <div
          onClick={() => nav(`/editar/${category}`)}
          className="rounded-2xl p-4 min-h-[92px] border border-dashed border-white/10 bg-white/[0.03] flex flex-col items-center justify-center gap-1 cursor-pointer text-white/30"
        >
          <IconPlus />
          <span className="text-[11px]">Nova categoria</span>
        </div>
      </div>
    </div>
  );
}
