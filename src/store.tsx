import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { PropsWithChildren } from "react";
import type { LiveData, Exercise, Categoria, Settings, Plan, HistoryEntry } from "./types";
import { seedData } from "./data/seed";
import {
  loadGithubConfig,
  saveGithubConfig,
  fetchLiveData,
  pushLiveData,
  type GithubConfig,
} from "./lib/github";

const LOCAL_KEY = "nodus:live-data";

function loadLocal(): LiveData {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return { ...seedData, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return seedData;
}

function saveLocal(data: LiveData) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
}

export type SyncStatus = "off" | "idle" | "syncing" | "ok" | "error";

interface StoreValue {
  data: LiveData;
  update: (updater: (draft: LiveData) => LiveData) => void;
  githubConfig: GithubConfig | null;
  setGithubConfig: (cfg: GithubConfig | null) => Promise<void>;
  syncStatus: SyncStatus;
  syncNow: () => Promise<void>;
  // atalhos convenientes
  setExercises: (v: Exercise[]) => void;
  setWorkouts: (v: Categoria[]) => void;
  setSettings: (v: Settings) => void;
  setPlan: (v: Plan) => void;
  addHistory: (entry: HistoryEntry) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<LiveData>(() => loadLocal());
  const [githubConfig, setGithubConfigState] = useState<GithubConfig | null>(() => loadGithubConfig());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(githubConfig ? "idle" : "off");
  const shaRef = useRef<string | null>(null);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  // ao arrancar, se houver config, busca a versão mais recente do GitHub
  useEffect(() => {
    if (!githubConfig) return;
    setSyncStatus("syncing");
    fetchLiveData<LiveData>(githubConfig)
      .then((res) => {
        if (res.content) {
          setData({ ...seedData, ...res.content });
          shaRef.current = res.sha;
        }
        setSyncStatus("ok");
      })
      .catch(() => setSyncStatus("error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const schedulePush = useCallback(
    (next: LiveData) => {
      saveLocal(next);
      if (!githubConfig) return;
      if (pushTimer.current) clearTimeout(pushTimer.current);
      pushTimer.current = setTimeout(async () => {
        setSyncStatus("syncing");
        try {
          const sha = await pushLiveData(githubConfig, dataRef.current, shaRef.current);
          shaRef.current = sha;
          setSyncStatus("ok");
        } catch {
          setSyncStatus("error");
        }
      }, 1500);
    },
    [githubConfig]
  );

  const update = useCallback(
    (updater: (draft: LiveData) => LiveData) => {
      setData((prev) => {
        const next = updater(prev);
        schedulePush(next);
        return next;
      });
    },
    [schedulePush]
  );

  const setGithubConfig = useCallback(async (cfg: GithubConfig | null) => {
    saveGithubConfig(cfg);
    setGithubConfigState(cfg);
    if (!cfg) {
      setSyncStatus("off");
      shaRef.current = null;
      return;
    }
    setSyncStatus("syncing");
    try {
      const res = await fetchLiveData<LiveData>(cfg);
      if (res.content) {
        setData({ ...seedData, ...res.content });
        shaRef.current = res.sha;
      } else {
        const sha = await pushLiveData(cfg, dataRef.current, null);
        shaRef.current = sha;
      }
      setSyncStatus("ok");
    } catch {
      setSyncStatus("error");
    }
  }, []);

  const syncNow = useCallback(async () => {
    if (!githubConfig) return;
    setSyncStatus("syncing");
    try {
      const sha = await pushLiveData(githubConfig, dataRef.current, shaRef.current);
      shaRef.current = sha;
      setSyncStatus("ok");
    } catch {
      setSyncStatus("error");
    }
  }, [githubConfig]);

  const value = useMemo<StoreValue>(
    () => ({
      data,
      update,
      githubConfig,
      setGithubConfig,
      syncStatus,
      syncNow,
      setExercises: (v) => update((d) => ({ ...d, exercises: v })),
      setWorkouts: (v) => update((d) => ({ ...d, workouts: v })),
      setSettings: (v) => update((d) => ({ ...d, settings: v })),
      setPlan: (v) => update((d) => ({ ...d, plan: v })),
      addHistory: (entry) => update((d) => ({ ...d, history: [...d.history, entry] })),
    }),
    [data, update, githubConfig, setGithubConfig, syncStatus, syncNow]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore deve ser usado dentro de <StoreProvider>");
  return ctx;
}

export function findExercise(data: LiveData, id: string): Exercise | undefined {
  return data.exercises.find((e) => e.id === id);
}
