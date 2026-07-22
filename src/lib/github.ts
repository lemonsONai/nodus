export interface GithubConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

const CONFIG_KEY = "nodus:github-config";
const LIVE_DATA_PATH = "data/live-data.json";

export function loadGithubConfig(): GithubConfig | null {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? (JSON.parse(raw) as GithubConfig) : null;
  } catch {
    return null;
  }
}

export function saveGithubConfig(cfg: GithubConfig | null) {
  if (cfg) localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
  else localStorage.removeItem(CONFIG_KEY);
}

function utf8ToBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}
function base64ToUtf8(str: string): string {
  return decodeURIComponent(escape(atob(str)));
}

export async function testConnection(cfg: GithubConfig): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}`, {
      headers: { Authorization: `token ${cfg.token}`, Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return { ok: false, message: `Repositório não encontrado ou sem acesso (${res.status})` };
    return { ok: true, message: "Ligado com sucesso." };
  } catch {
    return { ok: false, message: "Falha de rede." };
  }
}

export interface FetchResult<T> {
  content: T | null;
  sha: string | null;
}

export async function fetchLiveData<T>(cfg: GithubConfig): Promise<FetchResult<T>> {
  const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${LIVE_DATA_PATH}?ref=${cfg.branch || "main"}`;
  const res = await fetch(url, {
    headers: { Authorization: `token ${cfg.token}`, Accept: "application/vnd.github+json" },
  });
  if (res.status === 404) return { content: null, sha: null };
  if (!res.ok) throw new Error(`GitHub fetch falhou: ${res.status}`);
  const json = await res.json();
  const content = JSON.parse(base64ToUtf8(json.content)) as T;
  return { content, sha: json.sha as string };
}

export async function pushLiveData<T>(
  cfg: GithubConfig,
  data: T,
  sha: string | null,
  retry = false
): Promise<string> {
  const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${LIVE_DATA_PATH}`;
  const body: Record<string, unknown> = {
    message: "Nodus: atualizar dados",
    content: utf8ToBase64(JSON.stringify(data, null, 2)),
    branch: cfg.branch || "main",
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: { Authorization: `token ${cfg.token}`, Accept: "application/vnd.github+json" },
    body: JSON.stringify(body),
  });

  if (res.status === 409 && !retry) {
    const fresh = await fetchLiveData<T>(cfg);
    return pushLiveData(cfg, data, fresh.sha, true);
  }
  if (!res.ok) throw new Error(`GitHub push falhou: ${res.status}`);
  const json = await res.json();
  return json.content.sha as string;
}
