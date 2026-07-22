import type { LiveData, Treino } from "../types";

/** Escolhe um exercício do pool de um treino, rodando entre as opções válidas. */
export function pickForTreino(
  data: LiveData,
  workoutId: string,
  treino: Treino,
  rotation: Record<string, number>,
  setRotation: (next: Record<string, number>) => void
): string | null {
  const validPool = (treino.pool || []).filter((exId) => data.exercises.some((e) => e.id === exId));
  if (validPool.length === 0) return null;
  if (validPool.length === 1) return validPool[0];

  const key = `${workoutId}:${treino.id}`;
  const lastIndex = rotation[key] ?? -1;
  const nextIndex = (lastIndex + 1) % validPool.length;
  setRotation({ ...rotation, [key]: nextIndex });
  return validPool[nextIndex];
}
