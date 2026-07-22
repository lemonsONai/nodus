import { useState } from "react";
import { TopBar } from "../components/Layout";
import { IconClose } from "../components/Icons";
import { useStore } from "../store";
import { availableLetters, WEEKDAY_LONG } from "../lib/planning";
import { testConnection } from "../lib/github";
import { seedData } from "../data/seed";

const ACCENT_PRESETS = ["#C9FF3D", "#FFFFFF", "#FF6B4A", "#4AA8FF", "#FF4ADE"];
const BACKGROUNDS = [
  { id: "glow" as const, label: "Brilho" },
  { id: "diagonal" as const, label: "Diagonal" },
  { id: "grain" as const, label: "Grão" },
];

export function Admin() {
  const { data, setSettings, setPlan, update, githubConfig, setGithubConfig, syncStatus } = useStore();
  const [owner, setOwner] = useState(githubConfig?.owner || "");
  const [repo, setRepo] = useState(githubConfig?.repo || "");
  const [branch, setBranch] = useState(githubConfig?.branch || "main");
  const [token, setToken] = useState(githubConfig?.token || "");
  const [testMsg, setTestMsg] = useState<string | null>(null);

  const letters = ["rest", ...availableLetters(data)];

  return (
    <div>
      <TopBar label="Administração" right={<a href="#/"><IconClose /></a>} />

      <div className="card p-4 mb-5">
        <p className="text-sm font-semibold mb-3">Este dispositivo é de...</p>
        <p className="text-white/50 text-xs leading-relaxed mb-2.5">Usado para identificar quem fez cada sessão no histórico partilhado.</p>
        <input
          className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-sm"
          placeholder="ex: João"
          value={data.settings.personName}
          onChange={(e) => setSettings({ ...data.settings, personName: e.target.value })}
        />
      </div>

      <div className="card p-4 mb-5">
        <p className="text-sm font-semibold mb-3">Cor de destaque da app</p>
        <div className="flex gap-2 mb-3">
          {ACCENT_PRESETS.map((c) => (
            <button
              key={c}
              onClick={() => setSettings({ ...data.settings, accentColor: c })}
              className="w-[34px] h-[34px] rounded-full border-2"
              style={{ background: c, borderColor: c.toLowerCase() === data.settings.accentColor.toLowerCase() ? "#fff" : "transparent" }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <input type="color" value={data.settings.accentColor} onChange={(e) => setSettings({ ...data.settings, accentColor: e.target.value })} />
          <span className="text-sm text-white/50 font-mono">{data.settings.accentColor.toUpperCase()}</span>
        </div>
      </div>

      <div className="card p-4 mb-5">
        <p className="text-sm font-semibold mb-3">Fundo da app</p>
        <div className="flex gap-2.5">
          {BACKGROUNDS.map((bg) => (
            <button key={bg.id} onClick={() => setSettings({ ...data.settings, backgroundStyle: bg.id })} className="flex-1 flex flex-col items-center gap-1.5">
              <span
                className="block w-full aspect-square rounded-xl border-2"
                style={{ borderColor: data.settings.backgroundStyle === bg.id ? "var(--color-accent)" : "rgba(255,255,255,0.1)", background: "#000" }}
              />
              <span className="text-[11px]" style={{ color: data.settings.backgroundStyle === bg.id ? "#fff" : "rgba(255,255,255,0.3)" }}>{bg.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 mb-5">
        <p className="text-sm font-semibold mb-3">Plano semanal</p>
        {[1, 2, 3, 4, 5, 6, 0].map((dow) => (
          <div key={dow} className="flex items-center justify-between mb-2">
            <span className="text-sm">{WEEKDAY_LONG[dow]}</span>
            <select
              className="bg-white/5 border border-white/10 rounded-lg px-2 h-9 text-sm"
              value={data.plan.schedule[dow] || "rest"}
              onChange={(e) => setPlan({ ...data.plan, schedule: { ...data.plan.schedule, [dow]: e.target.value } })}
            >
              {letters.map((l) => (
                <option key={l} value={l}>{l === "rest" ? "Descanso" : "Categoria " + l}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="card p-4 mb-5">
        <p className="text-sm font-semibold mb-3">Sincronização GitHub (em tempo real)</p>
        <p className="text-white/50 text-xs leading-relaxed mb-3">
          Token de acesso pessoal (Contents: Read and write) gerado na tua conta GitHub.
        </p>
        <label className="text-xs text-white/50 block mb-1.5">Dono do repositório</label>
        <input className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-sm mb-3" value={owner} onChange={(e) => setOwner(e.target.value)} />
        <label className="text-xs text-white/50 block mb-1.5">Nome do repositório</label>
        <input className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-sm mb-3" value={repo} onChange={(e) => setRepo(e.target.value)} />
        <label className="text-xs text-white/50 block mb-1.5">Ramo</label>
        <input className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-sm mb-3" value={branch} onChange={(e) => setBranch(e.target.value)} />
        <label className="text-xs text-white/50 block mb-1.5">Token de acesso pessoal</label>
        <input type="password" className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-sm mb-3" value={token} onChange={(e) => setToken(e.target.value)} />
        <div className="flex gap-2 mb-2.5">
          <button
            className="btn flex-1"
            onClick={async () => {
              setTestMsg("A testar…");
              const r = await testConnection({ owner, repo, branch, token });
              setTestMsg((r.ok ? "✓ " : "⚠ ") + r.message);
            }}
          >
            Testar ligação
          </button>
          <button
            className="btn btn-accent flex-1"
            onClick={async () => {
              if (!owner || !repo || !token) { alert("Preenche pelo menos dono, repositório e token."); return; }
              await setGithubConfig({ owner, repo, branch: branch || "main", token });
            }}
          >
            Guardar e sincronizar
          </button>
        </div>
        <p className="text-white/50 text-xs">
          {testMsg || (githubConfig ? `Estado: ${syncStatus === "ok" ? "✓ sincronizado" : syncStatus === "error" ? "⚠ erro" : syncStatus === "syncing" ? "a sincronizar…" : "configurado"}` : "Ainda não configurado.")}
        </p>
        {githubConfig && (
          <button className="btn btn-danger w-full mt-2.5" onClick={() => setGithubConfig(null)}>
            Desligar sincronização neste dispositivo
          </button>
        )}
      </div>

      <div className="card p-4 mb-5">
        <p className="text-sm font-semibold mb-3">Repor dados de origem</p>
        <p className="text-white/50 text-xs leading-relaxed mb-3">
          Substitui exercícios, categorias e plano pelos dados de exemplo mais recentes. O histórico não é afetado.
        </p>
        <button
          className="btn btn-danger w-full"
          onClick={() => {
            if (!confirm("Substituir exercícios/categorias/plano pelos dados de exemplo? As tuas edições nessas áreas perdem-se.")) return;
            update((d) => ({ ...d, exercises: seedData.exercises, workouts: seedData.workouts, plan: seedData.plan }));
          }}
        >
          Repor exercícios, categorias e plano
        </button>
      </div>
    </div>
  );
}
