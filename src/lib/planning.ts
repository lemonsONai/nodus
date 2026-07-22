import type { LiveData, Categoria, HistoryEntry } from "../types";

export function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function letterForDate(data: LiveData, d: Date): string {
  return data.plan.schedule[d.getDay()] || "rest";
}

export function workoutForLetter(data: LiveData, letter: string): Categoria | undefined {
  return data.workouts.find((w) => w.day === letter);
}

export function availableLetters(data: LiveData): string[] {
  return [...new Set(data.workouts.map((w) => w.day).filter(Boolean) as string[])];
}

export function historyEntryFor(data: LiveData, date: string, workoutId: string): HistoryEntry | undefined {
  return data.history.find((h) => h.date === date && h.workoutId === workoutId);
}

export const WEEKDAY_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const WEEKDAY_LONG = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
