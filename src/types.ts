export type Category = "strength" | "yoga" | "mobility" | "custom";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Exercise {
  id: string;
  name: string;
  category: Category;
  primaryMuscle: string;
  secondaryMuscles: string[];
  difficulty: Difficulty;
  notes?: string;
  gif?: string;
  thumbnail?: string;
}

/** "Treino" na nova nomenclatura (antigo "phase") */
export interface Treino {
  id: string;
  label: string;
  sets: number;
  restSeconds: number;
  pool: string[]; // ids de exercícios
}

/** "Categoria" na nova nomenclatura (antigo "workout") */
export interface Categoria {
  id: string;
  name: string;
  day?: string;
  category: Category;
  phases: Treino[];
}

export interface Settings {
  theme: "dark";
  defaultRestSeconds: number;
  accentColor: string;
  personName: string;
  backgroundStyle: "glow" | "diagonal" | "grain";
}

export interface Plan {
  schedule: Record<number, string>; // 0=Domingo ... 6=Sábado -> letra ou "rest"
}

export interface Quote {
  text: string;
  author?: string;
}

export interface Quotes {
  strength: Quote;
  yoga: Quote;
}

export interface HistoryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  workoutId: string;
  workoutName: string;
  category: Category;
  day: string | null;
  person: string;
}

export interface LiveData {
  exercises: Exercise[];
  workouts: Categoria[];
  settings: Settings;
  plan: Plan;
  quotes: Quotes;
  history: HistoryEntry[];
  phaseRotation: Record<string, number>;
}
