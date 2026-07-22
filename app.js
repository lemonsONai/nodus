/*
  Nodus — app vanilla JS, sem build, sem npm.
  Abre-se diretamente pelo index.html em qualquer browser (PC, tablet, telemóvel).

  Persistência:
  - Os ficheiros em /data/*.js são a "biblioteca" de origem (o que sincronizas
    via OneDrive).
  - Qualquer edição feita no Admin Panel é guardada no localStorage DESTE
    dispositivo, para poderes testar na hora.
  - O botão "Exportar dados" no Admin gera ficheiros atualizados para
    substituíres em /data/ na pasta sincronizada, propagando as alterações
    aos outros dispositivos.
*/

const STORAGE_KEY = "nodus:overrides";

function loadOverrides() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveOverrides(overrides) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

const overrides = loadOverrides();

const state = {
  get exercises() {
    return overrides.exercises || window.NODUS_DATA.exercises;
  },
  set exercises(v) {
    overrides.exercises = v;
    saveOverrides(overrides);
  },
  get workouts() {
    return overrides.workouts || window.NODUS_DATA.workouts;
  },
  set workouts(v) {
    overrides.workouts = v;
    saveOverrides(overrides);
  },
  get settings() {
    return overrides.settings || window.NODUS_DATA.settings;
  },
  set settings(v) {
    overrides.settings = v;
    saveOverrides(overrides);
  },
  get plan() {
    return overrides.plan || window.NODUS_DATA.plan;
  },
  set plan(v) {
    overrides.plan = v;
    saveOverrides(overrides);
  },
  get history() {
    return overrides.history || [];
  },
  set history(v) {
    overrides.history = v;
    saveOverrides(overrides);
  },
};

function dateKey(d) {
  return d.toISOString().slice(0, 10);
}

function letterForDate(d) {
  return state.plan.schedule[d.getDay()] || "rest";
}

function workoutForLetter(letter) {
  return state.workouts.find((w) => w.day === letter);
}

function availableLetters() {
  const letters = state.workouts.map((w) => w.day).filter(Boolean);
  return [...new Set(letters)];
}

/* ---------- History (sessões completas) ---------- */

function historyEntryFor(dateStr, workoutId) {
  return state.history.find((h) => h.date === dateStr && h.workoutId === workoutId);
}

function logSession(dateStr, workout) {
  if (historyEntryFor(dateStr, workout.id)) return;
  const entry = {
    id: uid("hist"),
    date: dateStr,
    workoutId: workout.id,
    workoutName: workout.name,
    category: workout.category,
    day: workout.day || null,
    person: state.settings.personName || "Eu",
  };
  state.history = [...state.history, entry];
}

function unlogSession(dateStr, workoutId) {
  state.history = state.history.filter((h) => !(h.date === dateStr && h.workoutId === workoutId));
}

function toggleSession(dateStr, workout) {
  if (historyEntryFor(dateStr, workout.id)) unlogSession(dateStr, workout.id);
  else logSession(dateStr, workout);
}

function findExercise(id) {
  return state.exercises.find((e) => e.id === id);
}

function applyTheme() {
  document.documentElement.style.setProperty("--accent", state.settings.accentColor);
}

function topbarHtml(label, right) {
  return `<div class="topbar">
    <div style="display:flex;align-items:center;gap:8px;">
      <img src="assets/branding/logo.png" alt="Nodus" style="height:${label ? "14px" : "22px"};display:block;">
      ${label ? `<span style="color:var(--text-dim);font-size:13px;">${label}</span>` : ""}
    </div>
    ${right}
  </div>`;
}

const ICONS = {
  home: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5.5" width="16" height="15" rx="3"/><path d="M8 3.5v4M16 3.5v4M4.5 10.5h15"/></svg>`,
  grid: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h13M21 17h0"/><circle cx="13" cy="7" r="2.1"/><circle cx="7" cy="12" r="2.1"/><circle cx="17" cy="17" r="2.1"/></svg>`,
  close: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  barbell: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12h2M5 9.5v5M8 8v8M18 9.5v5M21.5 12h-2M16 8v8"/><path d="M8 12h8"/></svg>`,
  yoga: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4.2" r="1.9"/><path d="M4.5 18c1.5-3.2 4-5.4 7.5-5.4s6 2.2 7.5 5.4"/><path d="M7 14.2c-1 1.6-1.8 2.6-3.3 2.9M17 14.2c1 1.6 1.8 2.6 3.3 2.9"/></svg>`,
  stretch: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4.2" r="1.9"/><path d="M12 6.5v6M6.5 9l5.5 3 5.5-3M8 20l4-6.5M16 20l-4-6.5"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4l11-11a2.1 2.1 0 0 0-4-4L4 16v4Z"/><path d="M13.5 6.5l4 4"/></svg>`,
};

function icon(name) {
  return `<span class="icon">${ICONS[name] || ""}</span>`;
}

function uid(prefix) {
  return prefix + "-" + Math.random().toString(36).slice(2, 9);
}

function isVideo(path) {
  const ext = (path || "").split(".").pop().toLowerCase();
  return ext === "mp4" || ext === "webm";
}

function mediaHtml(path, alt) {
  if (!path) {
    return `<div class="media-frame"><span style="color:var(--text-faint);font-size:13px;">sem media</span></div>`;
  }
  if (isVideo(path)) {
    return `<div class="media-frame"><video src="${path}" autoplay loop muted playsinline aria-label="${alt}"></video></div>`;
  }
  return `<div class="media-frame"><img src="${path}" alt="${alt}"></div>`;
}

/* ---------- Router ---------- */

function navigate(hash) {
  location.hash = hash;
}

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  render();
});

function render() {
  applyTheme();
  const hash = location.hash.slice(1) || "/";
  const app = document.getElementById("app");
  const parts = hash.split("/").filter(Boolean);

  let html = "";
  if (parts.length === 0) html = viewHome();
  else if (parts[0] === "categories") html = viewCategories();
  else if (parts[0] === "category") html = viewCategoryList(parts[1]);
  else if (parts[0] === "builder") html = viewBuilder(parts[1], parts[2]);
  else if (parts[0] === "player") html = viewPlayer(parts[1]);
  else if (parts[0] === "plan") html = viewPlan(Number(parts[1] || 0));
  else if (parts[0] === "history") html = viewHistory();
  else if (parts[0] === "info") html = viewInfo();
  else if (parts[0] === "admin") html = viewAdmin();
  else html = viewHome();

  app.innerHTML = html + bottomNav(hash);
  attachHandlers(hash);
}

function bottomNav(hash) {
  const active = (p) => (hash === p || hash.startsWith(p + "/") ? "active" : "");
  return `
  <nav class="bottom-nav">
    <a href="#/" class="${active("")}">${icon("home")}<span>Início</span></a>
    <a href="#/plan/0" class="${active("plan")}">${icon("calendar")}<span>Plano</span></a>
    <a href="#/categories" class="${active("categories")}">${icon("grid")}<span>Categorias</span></a>
    <a href="#/admin" class="${active("admin")}">${icon("settings")}<span>Admin</span></a>
  </nav>`;
}

/* ---------- Home ---------- */

function viewHome() {
  return `
    <div style="text-align:center;padding:4px 0 20px;">
      <img src="assets/branding/logo.png" alt="Nodus" style="height:24px;display:inline-block;margin-bottom:18px;">
      <p style="color:rgba(255,255,255,0.55);font-size:13px;margin:0 0 6px;">Bom dia</p>
      <h1 style="color:#fff;font-size:30px;font-weight:700;letter-spacing:-0.5px;line-height:1.15;margin:0;">Escolhe o teu caminho</h1>
    </div>

    <div class="hero-portal">
      <div data-nav="#/category/strength" class="hero-portal-half">
        <img src="assets/branding/hero-strength.jpg" alt="Força">
      </div>
      <div data-nav="#/category/yoga" class="hero-portal-half">
        <img src="assets/branding/hero-yoga.jpg" alt="Yoga">
      </div>
    </div>

    <div style="text-align:center;margin-top:8px;">
      <a href="#/info" style="color:var(--text-faint);font-size:11px;text-decoration:none;">ⓘ Sobre & FAQ</a>
    </div>
  `;
}

/* ---------- Info & FAQ ---------- */

function viewInfo() {
  const changelog = [
    "Biblioteca de exercícios (força + yoga), com GIF/vídeo, notas e músculos",
    "Treinos por dia (letras A, B, C...) com séries e descanso configuráveis",
    "Workout Player com temporizador de descanso e ecrã de conclusão",
    "Plano semanal/mensal com calendário e marcação de dias feitos",
    "Histórico de sessões por pessoa, com exportar/importar e fusão automática",
    "Admin Panel: gerir exercícios, cor de destaque, plano semanal, sincronização",
    "Logo e imagem de marca em todos os ecrãs",
    "100% local, sem login, sem backend — corre por ficheiros (OneDrive/Drive/servidor local)",
  ];

  const faqs = [
    {
      q: "Como faço backup e sincronizo entre dispositivos?",
      a: "Há dois exports diferentes. Em Admin → \"Exportar dados\": guarda exercícios, treinos, cor e plano semanal — usa isto sempre que editares a biblioteca. Em Histórico → \"Exportar\"/\"Importar\": guarda as sessões feitas — a importação funde automaticamente sem duplicar, mesmo repetindo. Coloca os ficheiros exportados na pasta partilhada (OneDrive, Drive, ou servidor local em casa) para chegarem aos outros dispositivos.",
    },
    {
      q: "Onde coloco os meus GIFs/vídeos dos exercícios?",
      a: "Em assets/exercises/ (ou assets/yoga/, assets/mobility/). Formatos aceites: .gif, .mp4, .webm — prefere MP4/WebM, ficam muito mais leves. Depois aponta o caminho no campo \"gif\" do exercício (Admin ou editando data/exercises.js diretamente).",
    },
    {
      q: "Como funcionam as séries e o descanso?",
      a: "Cada exercício de um treino tem um nº de séries e segundos de descanso, ajustáveis no Builder com os botões −/+. No Player, repete o mesmo exercício até esgotares as séries (com descanso entre cada) antes de avançar para o seguinte.",
    },
  ];

  return `
    ${topbarHtml("Sobre & FAQ", `<a href="#/">${icon("close")}</a>`)}

    <p class="section-label">O que já existe (v1)</p>
    <div class="card" style="margin-bottom:20px;">
      ${changelog.map((c) => `
        <div style="display:flex;gap:8px;padding:6px 0;">
          <span style="color:var(--accent);font-size:13px;">✓</span>
          <span style="font-size:13px;color:rgba(255,255,255,0.8);line-height:1.4;">${c}</span>
        </div>`).join("")}
    </div>

    <p class="section-label">Perguntas frequentes</p>
    ${faqs.map((f) => `
      <div class="card" style="margin-bottom:12px;">
        <p style="font-size:13px;font-weight:600;margin-bottom:6px;">${f.q}</p>
        <p style="font-size:12px;color:var(--text-dim);line-height:1.6;margin:0;">${f.a}</p>
      </div>`).join("")}
  `;
}

/* ---------- Categories ---------- */

function viewCategories() {
  const cats = [
    { id: "strength", label: "Força", icon: "barbell" },
    { id: "yoga", label: "Yoga", icon: "yoga" },
    { id: "mobility", label: "Mobilidade", icon: "stretch" },
    { id: "custom", label: "Personalizado", icon: "plus" },
  ];
  return `
    ${topbarHtml("Categorias", `<a href="#/">${icon("close")}</a>`)}
    <div class="grid-2">
      ${cats.map((c) => `
        <div class="category-tile" data-cat="${c.id}">
          <span style="color:rgba(255,255,255,0.85);">${icon(c.icon)}</span>
          <span>${c.label}</span>
        </div>`).join("")}
    </div>
  `;
}

/* ---------- Plan (weekly strip + monthly calendar) ---------- */

const WEEKDAY_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const WEEKDAY_LONG = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

function weekStrip() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const rows = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const letter = letterForDate(d);
    const workout = letter !== "rest" ? workoutForLetter(letter) : null;
    const key = dateKey(d);
    const done = workout ? !!historyEntryFor(key, workout.id) : false;
    const isToday = i === 0;

    rows.push(`
      <div class="row" style="padding:0 16px;${workout ? "cursor:pointer;" : ""}" ${workout ? `data-nav="#/player/${workout.id}"` : ""}>
        <div>
          <span style="font-size:14px;${isToday ? "font-weight:600;" : ""}">${WEEKDAY_SHORT[d.getDay()]}</span>
          <span style="color:var(--text-faint);font-size:11px;margin-left:8px;">${d.getDate()}/${d.getMonth() + 1}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:12px;color:${letter === "rest" ? "var(--text-faint)" : "var(--text-dim)"};">${letter === "rest" ? "Descanso" : (workout ? workout.name : "Treino " + letter)}</span>
          ${workout ? `<button class="day-toggle" data-toggle-session="${key}:${workout.id}" style="width:22px;height:22px;border-radius:50%;border:1px solid ${done ? "var(--accent)" : "var(--border)"};background:${done ? "var(--accent)" : "transparent"};color:${done ? "#0a0a09" : "transparent"};font-size:12px;line-height:1;">✓</button>` : ""}
        </div>
      </div>`);
  }
  return rows.join("");
}

function viewPlan(monthOffset) {
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

  let cells = "";
  for (let i = 0; i < startOffset; i++) cells += `<div></div>`;
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const key = dateKey(d);
    const letter = letterForDate(d);
    const done = letter !== "rest" && workoutForLetter(letter) ? !!historyEntryFor(key, workoutForLetter(letter).id) : false;
    const isToday = key === todayKey;
    const workout = letter !== "rest" ? workoutForLetter(letter) : null;

    cells += `
      <div ${workout ? `data-nav="#/player/${workout.id}"` : ""} style="aspect-ratio:1;border-radius:10px;background:${isToday ? "var(--surface-2)" : "transparent"};border:1px solid ${isToday ? "var(--border)" : "transparent"};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;${workout ? "cursor:pointer;" : ""}">
        <span style="font-size:12px;color:${isToday ? "var(--text)" : "var(--text-dim)"};">${day}</span>
        ${letter !== "rest" ? `<span style="font-size:10px;color:${done ? "var(--accent)" : "var(--text-faint)"};font-weight:600;">${letter}</span>` : `<span style="font-size:10px;color:var(--text-faint);opacity:0.4;">·</span>`}
      </div>`;
  }

  return `
    ${topbarHtml("Plano", `<a href="#/">${icon("close")}</a>`)}
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <button data-month="${monthOffset - 1}" style="background:none;border:none;color:var(--text-dim);">${icon("chevronLeft")}</button>
      <span style="font-size:14px;font-weight:600;text-transform:capitalize;">${monthLabel}</span>
      <button data-month="${monthOffset + 1}" style="background:none;border:none;color:var(--text-dim);">${icon("chevronRight")}</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:8px;">
      ${WEEKDAY_SHORT.map((w) => `<span style="font-size:10px;color:var(--text-faint);text-align:center;">${w[0]}</span>`).join("")}
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:20px;">
      ${cells}
    </div>
    <button class="btn" style="width:100%;margin-bottom:8px;" data-nav="#/history">Ver histórico</button>
    <button class="btn" style="width:100%;" data-nav="#/admin">Editar plano semanal</button>
  `;
}

/* ---------- History view ---------- */

function viewHistory() {
  const history = [...state.history].sort((a, b) => (a.date < b.date ? 1 : -1));
  const now = new Date();
  const thisMonthKey = now.toISOString().slice(0, 7);

  const thisMonth = history.filter((h) => h.date.slice(0, 7) === thisMonthKey);
  const people = [...new Set(thisMonth.map((h) => h.person || "Eu"))];

  const byMonth = {};
  history.forEach((h) => {
    const m = h.date.slice(0, 7);
    byMonth[m] = byMonth[m] || [];
    byMonth[m].push(h);
  });
  const months = Object.keys(byMonth).sort().reverse();

  return `
    ${topbarHtml("Histórico", `<a href="#/plan/0">${icon("close")}</a>`)}

    <p class="section-label">Este mês</p>
    <div class="card" style="margin-bottom:20px;">
      ${people.length ? people.map((p) => {
        const mine = thisMonth.filter((h) => (h.person || "Eu") === p);
        const s = mine.filter((h) => h.category === "strength").length;
        const y = mine.filter((h) => h.category === "yoga").length;
        return `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);">
          <span style="font-size:14px;">${p}</span>
          <span style="font-size:12px;color:var(--text-dim);">${s} treino &middot; ${y} yoga</span>
        </div>`;
      }).join("") : `<p style="font-size:13px;color:var(--text-dim);">Ainda sem sessões este mês.</p>`}
    </div>

    <div class="card" style="margin-bottom:20px;">
      <p style="font-size:13px;font-weight:600;margin-bottom:8px;">Consolidar entre dispositivos</p>
      <p style="font-size:12px;color:var(--text-dim);line-height:1.6;margin-bottom:12px;">
        Exporta o histórico deste dispositivo e importa-o noutro (ou o mesmo
        ficheiro em todos) — a fusão evita duplicados automaticamente.
      </p>
      <div style="display:flex;gap:8px;">
        <button class="btn" style="flex:1;" id="exportHistBtn">Exportar</button>
        <button class="btn" style="flex:1;" id="importHistBtn">Importar</button>
      </div>
      <input type="file" id="importHistFile" accept="application/json" style="display:none;">
    </div>

    ${months.length ? months.map((m) => `
      <p class="section-label">${new Date(m + "-01").toLocaleDateString("pt-PT", { month: "long", year: "numeric" })}</p>
      <div class="card" style="padding:0;margin-bottom:16px;">
        ${byMonth[m].sort((a, b) => (a.date < b.date ? 1 : -1)).map((h) => `
          <div class="row" style="padding:0 16px;">
            <div>
              <span style="font-size:14px;">${h.workoutName}${h.day ? " · " + h.day : ""}</span>
              <span style="color:var(--text-faint);font-size:11px;margin-left:8px;">${h.person || "Eu"}</span>
            </div>
            <span style="color:var(--text-faint);font-size:12px;">${new Date(h.date).toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" })}</span>
          </div>`).join("")}
      </div>`).join("") : `<p style="color:var(--text-dim);font-size:13px;">Ainda sem sessões registadas. Completa um treino ou marca ✓ no Plano.</p>`}
  `;
}

function exportHistory() {
  downloadFile("history.json", JSON.stringify(state.history, null, 2));
}

function importHistoryFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const incoming = JSON.parse(reader.result);
      const existing = state.history;
      const seen = new Set(existing.map((h) => h.date + ":" + h.workoutId));
      const merged = [...existing];
      incoming.forEach((h) => {
        const sig = h.date + ":" + h.workoutId;
        if (!seen.has(sig)) {
          merged.push(h);
          seen.add(sig);
        }
      });
      state.history = merged;
      render();
    } catch {
      alert("Ficheiro inválido.");
    }
  };
  reader.readAsText(file);
}

/* ---------- Category list ---------- */

const CATEGORY_LABELS = {
  strength: "Treino",
  yoga: "Yoga",
  mobility: "Mobilidade",
  custom: "Personalizado",
};

function viewCategoryList(cat) {
  const label = CATEGORY_LABELS[cat] || cat;
  const days = state.workouts.filter((w) => w.category === cat);
  const heroClass = cat === "yoga" ? "hero-panel-yoga" : "hero-panel-strength";
  const today = new Date();
  const todayLetter = letterForDate(today);

  const quote = window.NODUS_DATA.quotes && window.NODUS_DATA.quotes[cat];

  const heroHeader = `
    <div class="${heroClass}" style="border-radius:24px;padding:24px 20px;margin-bottom:20px;position:relative;overflow:hidden;">
      <div style="position:absolute;top:-30px;right:-30px;width:140px;height:140px;border-radius:50%;background:radial-gradient(circle, var(--accent) 0%, transparent 70%);opacity:0.18;"></div>
      <div style="position:relative;display:flex;justify-content:space-between;align-items:flex-start;gap:18px;flex-wrap:wrap;">
        <div style="min-width:140px;">
          <p style="color:rgba(255,255,255,0.5);font-size:12px;letter-spacing:2px;margin:0 0 4px;">NODUS</p>
          <h1 style="color:#fff;font-size:26px;font-weight:600;margin:0;">${label}</h1>
        </div>
        ${quote ? `
        <div style="flex:1;min-width:170px;max-width:240px;border-left:2px solid var(--accent);padding-left:14px;">
          <p style="color:rgba(255,255,255,0.85);font-size:13px;font-style:italic;line-height:1.55;margin:0;">"${quote.text}"</p>
          ${quote.author ? `<p style="color:var(--text-faint);font-size:11px;letter-spacing:0.5px;margin:8px 0 0;">— ${quote.author}</p>` : ""}
        </div>` : ""}
      </div>
    </div>`;

  if (cat === "strength") {
    const dayLetters = ["A", "B", "C", "D", "E"];
    const dayCards = dayLetters.map((letter) => {
      const w = days.find((d) => d.day === letter);
      const isToday = letter === todayLetter;
      if (!w) {
        return `
          <div data-nav="#/builder/${cat}/${letter}" style="border-radius:16px;padding:16px;background:var(--surface-2);border:1px dashed var(--border);display:flex;flex-direction:column;justify-content:center;align-items:center;gap:4px;cursor:pointer;min-height:92px;">
            <span style="color:var(--text-faint);font-size:20px;font-weight:600;">${letter}</span>
            <span style="color:var(--text-faint);font-size:11px;">+ criar</span>
          </div>`;
      }
      return `
        <div data-nav="#/player/${w.id}" style="border-radius:16px;padding:16px;background:${isToday ? "linear-gradient(160deg, var(--tone-strength-1), var(--tone-strength-2))" : "var(--surface)"};border:1px solid ${isToday ? "var(--accent)" : "var(--border)"};cursor:pointer;min-height:92px;position:relative;">
          <button data-edit="${w.id}" style="position:absolute;top:10px;left:10px;width:26px;height:26px;border-radius:8px;background:rgba(255,255,255,0.08);border:none;color:rgba(255,255,255,0.7);display:flex;align-items:center;justify-content:center;">${icon("edit")}</button>
          ${isToday ? `<span style="position:absolute;top:10px;right:12px;color:var(--accent);font-size:10px;font-weight:600;letter-spacing:1px;">HOJE</span>` : ""}
          <p style="color:var(--text-faint);font-size:11px;margin:22px 0 6px;">Treino ${letter}</p>
          <p style="color:#fff;font-size:15px;font-weight:600;margin:0 0 4px;">${w.name}</p>
          <p style="color:var(--text-faint);font-size:11px;margin:0;">${w.exercises.length} exercícios</p>
        </div>`;
    }).join("");

    return `
      ${topbarHtml(null, `<a href="#/">${icon("close")}</a>`)}
      ${heroHeader}

      <p class="section-label" style="margin-top:0;">Esta semana</p>
      <div class="card" style="padding:0;margin-bottom:20px;">
        ${weekStrip()}
      </div>

      <p class="section-label">Que treino queres fazer hoje?</p>
      <div class="day-grid" style="margin-bottom:20px;">
        ${dayCards}
      </div>
    `;
  }

  // Yoga (e outras categorias) — vista simples, em pausa por agora
  return `
    ${topbarHtml(null, `<a href="#/">${icon("close")}</a>`)}
    ${heroHeader}
    ${days.length ? `
    <div class="card" style="padding:0;margin-bottom:16px;">
      ${days.map((w) => `
        <div class="row" style="padding:0 16px;cursor:pointer;" data-nav="#/player/${w.id}">
          <div>
            <span style="font-size:14px;">${w.name}</span>
            ${w.day ? `<span style="color:var(--text-faint);font-size:11px;margin-left:8px;">${w.day}</span>` : ""}
          </div>
          <div style="display:flex;align-items:center;gap:12px;">
            <button data-edit="${w.id}" style="width:26px;height:26px;border-radius:8px;background:rgba(255,255,255,0.06);border:none;color:rgba(255,255,255,0.6);display:flex;align-items:center;justify-content:center;">${icon("edit")}</button>
            <span style="color:var(--text-faint);font-size:12px;">${w.exercises.length} ex.</span>
          </div>
        </div>`).join("")}
    </div>` : `<p style="color:var(--text-dim);font-size:13px;margin-bottom:16px;">Ainda sem dias nesta categoria.</p>`}
    <button class="btn btn-accent" style="width:100%;" data-nav="#/builder/${cat}">+ Novo dia de ${label.toLowerCase()}</button>
  `;
}

/* ---------- Builder ---------- */

function viewBuilder(workoutId, presetDay) {
  let workout = state.workouts.find((w) => w.id === workoutId);

  if (!workout) {
    // se vier de uma categoria (não de um id de treino existente), cria um novo
    const category = workoutId || "custom";
    workout = { id: uid("wo"), name: presetDay ? `Treino ${presetDay}` : "Novo treino", category, day: presetDay || undefined, exercises: [] };
    const workouts = [...state.workouts, workout];
    state.workouts = workouts;
    navigate(`#/builder/${workout.id}`);
    return "";
  }

  const rows = workout.exercises.map((we, idx) => {
    const ex = findExercise(we.exerciseId);
    const sets = we.sets || 1;
    return `
      <div style="padding:12px 16px;border-bottom:1px solid var(--border);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <span style="font-size:14px;">${ex ? ex.name : "?"}</span>
          <div style="display:flex;align-items:center;gap:6px;">
            <button data-move="${idx}:-1" style="background:none;border:none;color:var(--text-dim);font-size:15px;">↑</button>
            <button data-move="${idx}:1" style="background:none;border:none;color:var(--text-dim);font-size:15px;">↓</button>
            <button data-remove="${idx}" style="background:none;border:none;color:#ff6b6b;font-size:15px;">×</button>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:16px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="color:var(--text-faint);font-size:11px;">Séries</span>
            <button data-sets="${idx}:-1" style="width:24px;height:24px;border-radius:8px;background:var(--surface-2);border:1px solid var(--border);color:#fff;">−</button>
            <span style="font-size:13px;min-width:12px;text-align:center;">${sets}</span>
            <button data-sets="${idx}:1" style="width:24px;height:24px;border-radius:8px;background:var(--surface-2);border:1px solid var(--border);color:#fff;">+</button>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="color:var(--text-faint);font-size:11px;">Descanso</span>
            <button data-rest="${idx}:-15" style="width:24px;height:24px;border-radius:8px;background:var(--surface-2);border:1px solid var(--border);color:#fff;">−</button>
            <span style="font-size:13px;min-width:32px;text-align:center;">${we.restSeconds}s</span>
            <button data-rest="${idx}:15" style="width:24px;height:24px;border-radius:8px;background:var(--surface-2);border:1px solid var(--border);color:#fff;">+</button>
          </div>
        </div>
      </div>`;
  }).join("");

  const available = state.exercises.filter(
    (ex) => !workout.exercises.some((we) => we.exerciseId === ex.id)
  );

  return `
    ${topbarHtml("Editar dia", `<a href="#/">${icon("close")}</a>`)}

    <label>Nome do treino</label>
    <input type="text" id="w-name" value="${workout.name}" data-workout-id="${workout.id}">
    <label>Etiqueta do dia (opcional, ex: "Dia 1")</label>
    <input type="text" id="w-day" value="${workout.day || ""}" data-workout-id="${workout.id}">

    <div class="card" style="padding:0;margin-bottom:20px;">
      ${rows || `<p style="color:var(--text-faint);font-size:13px;padding:16px;">Sem exercícios ainda.</p>`}
    </div>

    <p class="section-label">Adicionar exercício</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;">
      ${available.map((ex) => `
        <button class="btn" style="height:36px;padding:0 12px;font-size:12px;width:auto;" data-add-ex="${ex.id}" data-workout="${workout.id}">+ ${ex.name}</button>
      `).join("")}
    </div>

    <button class="btn btn-accent" style="width:100%;" data-nav="#/player/${workout.id}">Ir para o player ▶</button>

    <div style="margin-top:20px;">
      <button class="btn btn-danger" style="width:100%;" data-delete-workout="${workout.id}">Apagar treino</button>
    </div>
  `;
}

/* ---------- Player ---------- */

const playerState = { workoutId: null, index: 0, setIndex: 0, resting: false, seconds: 0, timer: null, finished: false };

function viewPlayer(workoutId) {
  const workout = state.workouts.find((w) => w.id === workoutId);
  if (!workout) return `<p style="color:var(--text-dim);">Treino não encontrado.</p>`;

  if (playerState.workoutId !== workoutId) {
    clearInterval(playerState.timer);
    playerState.workoutId = workoutId;
    playerState.index = 0;
    playerState.setIndex = 0;
    playerState.resting = false;
    playerState.finished = false;
  }

  const total = workout.exercises.length;
  const slot = workout.exercises[playerState.index];
  const ex = slot ? findExercise(slot.exerciseId) : null;
  const totalSets = (slot && slot.sets) || 1;

  if (!ex) return `<p style="color:var(--text-dim);">Treino vazio. Adiciona exercícios no builder.</p>`;

  if (playerState.finished) {
    return `
      ${topbarHtml(workout.name, `<a href="#/">${icon("close")}</a>`)}
      <div style="text-align:center;margin-top:60px;">
        <p style="font-size:40px;margin-bottom:12px;">✓</p>
        <p style="color:#fff;font-size:18px;font-weight:600;margin-bottom:6px;">Treino completo</p>
        <p style="color:var(--text-dim);font-size:13px;margin-bottom:28px;">Registado no histórico de hoje.</p>
        <button class="btn btn-accent" style="width:auto;padding:0 20px;" data-nav="#/">Voltar ao início</button>
      </div>
    `;
  }

  if (playerState.resting) {
    const isLastSetOfExercise = playerState.setIndex >= totalSets - 1;
    return `
      ${topbarHtml(workout.name, `<a href="#/">${icon("close")}</a>`)}
      <p style="color:var(--text-dim);font-size:13px;text-align:center;margin-top:40px;">Descanso</p>
      ${totalSets > 1 ? `<p style="color:var(--text-faint);font-size:12px;text-align:center;margin:0;">${isLastSetOfExercise ? "Próximo: " + (workout.exercises[playerState.index + 1] ? findExercise(workout.exercises[playerState.index + 1].exerciseId).name : "fim") : "Série " + (playerState.setIndex + 2) + " / " + totalSets + " de " + ex.name}</p>` : ""}
      <p class="timer-display" id="timerDisplay">${playerState.seconds}</p>
      <div class="controls-row" style="justify-content:center;">
        <button class="btn" style="width:auto;padding:0 16px;" data-add-time="30">+30s</button>
        <button class="btn" style="width:auto;padding:0 16px;" data-skip-rest="1">Saltar descanso</button>
      </div>
    `;
  }

  return `
    <div class="player-scroll">
      ${topbarHtml(`${playerState.index + 1} / ${total}`, `<a href="#/">${icon("close")}</a>`)}
      ${mediaHtml(ex.gif, ex.name)}
      <p style="font-size:22px;font-weight:600;margin-bottom:4px;">${ex.name}</p>
      <p style="color:var(--text-dim);font-size:14px;margin-bottom:${totalSets > 1 ? "2px" : "12px"};">${ex.primaryMuscle}${ex.secondaryMuscles && ex.secondaryMuscles.length ? " · secundário: " + ex.secondaryMuscles.join(", ") : ""}</p>
      ${totalSets > 1 ? `<p style="color:var(--accent);font-size:13px;font-weight:600;margin-bottom:12px;">Série ${playerState.setIndex + 1} / ${totalSets}</p>` : ""}
      ${ex.notes ? `<p style="color:rgba(255,255,255,0.65);font-size:13px;line-height:1.6;">${ex.notes}</p>` : ""}
    </div>
    <div class="controls-row controls-fixed">
      <button class="btn" data-prev="1" ${playerState.index === 0 ? "disabled style='opacity:0.3'" : ""}>${icon("chevronLeft")}</button>
      <button class="btn btn-accent btn-complete" data-complete="${slot.restSeconds || 60}">${totalSets > 1 && playerState.setIndex < totalSets - 1 ? "Completar série" : "Completar exercício"}</button>
      <button class="btn" data-next="1" ${playerState.index === total - 1 ? "disabled style='opacity:0.3'" : ""}>${icon("chevronRight")}</button>
    </div>
  `;
}

function startRest(seconds) {
  playerState.resting = true;
  playerState.seconds = seconds;
  render();
  playerState.timer = setInterval(() => {
    playerState.seconds--;
    const el = document.getElementById("timerDisplay");
    if (el) el.textContent = playerState.seconds;
    if (playerState.seconds <= 0) {
      clearInterval(playerState.timer);
      goNext();
    }
  }, 1000);
}

function skipToNextExercise() {
  clearInterval(playerState.timer);
  playerState.resting = false;
  const workout = state.workouts.find((w) => w.id === playerState.workoutId);
  if (playerState.index >= workout.exercises.length - 1) {
    logSession(dateKey(new Date()), workout);
    playerState.finished = true;
  } else {
    playerState.index++;
    playerState.setIndex = 0;
  }
  render();
}
function goNext() {
  clearInterval(playerState.timer);
  playerState.resting = false;
  const workout = state.workouts.find((w) => w.id === playerState.workoutId);
  const slot = workout.exercises[playerState.index];
  const totalSets = (slot && slot.sets) || 1;

  if (playerState.setIndex < totalSets - 1) {
    playerState.setIndex++;
    render();
    return;
  }

  if (playerState.index >= workout.exercises.length - 1) {
    logSession(dateKey(new Date()), workout);
    playerState.finished = true;
  } else {
    playerState.index = Math.min(playerState.index + 1, workout.exercises.length - 1);
    playerState.setIndex = 0;
  }
  render();
}

/* ---------- Admin ---------- */

function viewAdmin() {
  const presets = ["#C9FF3D", "#FFFFFF", "#FF6B4A", "#4AA8FF", "#FF4ADE"];
  const accent = state.settings.accentColor;

  return `
    ${topbarHtml("Administração", `<a href="#/">${icon("close")}</a>`)}

    <div class="card" style="margin-bottom:20px;">
      <p style="font-size:13px;font-weight:600;margin-bottom:12px;">Este dispositivo é de...</p>
      <p style="font-size:12px;color:var(--text-dim);line-height:1.6;margin-bottom:10px;">
        Usado para identificar quem fez cada sessão no histórico partilhado.
      </p>
      <input type="text" id="personNameInput" value="${state.settings.personName || ""}" placeholder="ex: João">
    </div>

    <div class="card" style="margin-bottom:20px;">
      <p style="font-size:13px;font-weight:600;margin-bottom:12px;">Cor de destaque da app</p>
      <div class="swatches">
        ${presets.map((c) => `<button class="swatch ${c.toLowerCase() === accent.toLowerCase() ? "active" : ""}" style="background:${c};" data-color="${c}"></button>`).join("")}
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <input type="color" id="colorInput" value="${accent}">
        <span style="font-size:13px;color:var(--text-dim);font-family:monospace;">${accent.toUpperCase()}</span>
      </div>
    </div>

    <div class="card" style="margin-bottom:20px;">
      <p style="font-size:13px;font-weight:600;margin-bottom:12px;">Plano semanal</p>
      <p style="font-size:12px;color:var(--text-dim);line-height:1.6;margin-bottom:12px;">
        Define que letra de treino corresponde a cada dia da semana.
      </p>
      ${scheduleEditorHtml()}
    </div>

    <div class="card" style="margin-bottom:20px;">
      <p style="font-size:13px;font-weight:600;margin-bottom:12px;">Sincronização</p>
      <p style="font-size:12px;color:var(--text-dim);line-height:1.6;margin-bottom:12px;">
        As alterações feitas aqui ficam guardadas neste dispositivo. Para propagares
        para os outros (via OneDrive), exporta os ficheiros e substitui-os na pasta /data/.
      </p>
      <button class="btn" style="width:100%;" id="exportBtn">Exportar dados atualizados</button>
    </div>

    <p class="section-label">Exercícios</p>
    <div class="card" style="padding:0;margin-bottom:16px;">
      ${state.exercises.map((ex) => `
        <div class="row" style="padding:0 16px;">
          <div>
            <p style="font-size:14px;">${ex.name}</p>
            <p style="font-size:11px;color:var(--text-faint);">${ex.primaryMuscle}</p>
          </div>
          <div style="display:flex;gap:6px;">
            <button class="btn" style="height:32px;padding:0 10px;font-size:12px;width:auto;" data-edit-ex="${ex.id}">Editar</button>
            <button class="btn btn-danger" style="height:32px;padding:0 10px;font-size:12px;width:auto;" data-remove-ex="${ex.id}">Apagar</button>
          </div>
        </div>`).join("")}
    </div>
    <button class="btn" style="width:100%;" id="newExBtn">+ Novo exercício</button>

    <div id="exerciseFormWrap"></div>
  `;
}

function exerciseFormHtml(ex) {
  const e = ex || { id: uid("ex"), name: "", category: "strength", primaryMuscle: "", secondaryMuscles: [], difficulty: "beginner", notes: "", gif: "", thumbnail: "" };
  return `
    <div class="card" style="margin-top:16px;">
      <label>Nome</label>
      <input type="text" id="f-name" value="${e.name}">
      <label>Categoria</label>
      <select id="f-category">
        ${["strength","yoga","mobility","custom"].map((c) => `<option value="${c}" ${c===e.category?"selected":""}>${c}</option>`).join("")}
      </select>
      <label>Músculo primário</label>
      <input type="text" id="f-muscle" value="${e.primaryMuscle}">
      <label>Músculos secundários (vírgula)</label>
      <input type="text" id="f-secondary" value="${(e.secondaryMuscles||[]).join(", ")}">
      <label>Notas</label>
      <textarea id="f-notes" rows="3">${e.notes||""}</textarea>
      <label>Caminho do GIF/vídeo (em assets/exercises/)</label>
      <input type="text" id="f-gif" value="${e.gif||""}" placeholder="assets/exercises/nome.mp4">
      <div style="display:flex;gap:8px;">
        <button class="btn" id="f-cancel">Cancelar</button>
        <button class="btn btn-accent" id="f-save" data-id="${e.id}">Guardar</button>
      </div>
    </div>
  `;
}

function scheduleEditorHtml() {
  const letters = ["rest", ...availableLetters()];
  const schedule = state.plan.schedule;
  return [1, 2, 3, 4, 5, 6, 0].map((dow) => `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
      <span style="font-size:13px;">${WEEKDAY_LONG[dow]}</span>
      <select data-dow="${dow}" style="width:auto;margin-bottom:0;">
        ${letters.map((l) => `<option value="${l}" ${schedule[dow] === l ? "selected" : ""}>${l === "rest" ? "Descanso" : "Treino " + l}</option>`).join("")}
      </select>
    </div>
  `).join("");
}

function downloadFile(filename, content) {
  const type = filename.endsWith(".json") ? "application/json" : "text/javascript";
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportData() {
  downloadFile("exercises.js", `window.NODUS_DATA = window.NODUS_DATA || {};\nwindow.NODUS_DATA.exercises = ${JSON.stringify(state.exercises, null, 2)};\n`);
  downloadFile("workouts.js", `window.NODUS_DATA = window.NODUS_DATA || {};\nwindow.NODUS_DATA.workouts = ${JSON.stringify(state.workouts, null, 2)};\n`);
  downloadFile("settings.js", `window.NODUS_DATA = window.NODUS_DATA || {};\nwindow.NODUS_DATA.settings = ${JSON.stringify(state.settings, null, 2)};\n`);
  downloadFile("plan.js", `window.NODUS_DATA = window.NODUS_DATA || {};\nwindow.NODUS_DATA.plan = ${JSON.stringify(state.plan, null, 2)};\n`);
}

/* ---------- Event handling (delegated) ---------- */

function attachHandlers(hash) {
  const app = document.getElementById("app");

  app.querySelectorAll("[data-toggle-session]").forEach((el) =>
    el.addEventListener("click", (evt) => {
      evt.stopPropagation();
      const [key, workoutId] = el.getAttribute("data-toggle-session").split(":");
      const workout = state.workouts.find((w) => w.id === workoutId);
      if (workout) toggleSession(key, workout);
      render();
    })
  );
  app.querySelectorAll("[data-month]").forEach((el) =>
    el.addEventListener("click", () => navigate(`#/plan/${el.getAttribute("data-month")}`))
  );

  const exportHistBtn = app.querySelector("#exportHistBtn");
  if (exportHistBtn) exportHistBtn.addEventListener("click", exportHistory);
  const importHistBtn = app.querySelector("#importHistBtn");
  const importHistFile = app.querySelector("#importHistFile");
  if (importHistBtn && importHistFile) {
    importHistBtn.addEventListener("click", () => importHistFile.click());
    importHistFile.addEventListener("change", (e) => {
      if (e.target.files[0]) importHistoryFile(e.target.files[0]);
    });
  }

  app.querySelectorAll("[data-edit]").forEach((el) =>
    el.addEventListener("click", (evt) => {
      evt.stopPropagation();
      navigate(`#/builder/${el.getAttribute("data-edit")}`);
    })
  );

  app.querySelectorAll("[data-nav]").forEach((el) =>
    el.addEventListener("click", () => navigate(el.getAttribute("data-nav")))
  );

  app.querySelectorAll("[data-cat]").forEach((el) =>
    el.addEventListener("click", () => navigate(`#/category/${el.getAttribute("data-cat")}`))
  );

  // Builder
  app.querySelectorAll("[data-add-ex]").forEach((el) =>
    el.addEventListener("click", () => {
      const workoutId = el.getAttribute("data-workout");
      const exerciseId = el.getAttribute("data-add-ex");
      const workouts = state.workouts.map((w) =>
        w.id === workoutId ? { ...w, exercises: [...w.exercises, { exerciseId, restSeconds: 60, sets: 3 }] } : w
      );
      state.workouts = workouts;
      render();
    })
  );
  app.querySelectorAll("[data-remove]").forEach((el) =>
    el.addEventListener("click", () => {
      const idx = Number(el.getAttribute("data-remove"));
      const workoutId = location.hash.split("/")[2];
      const workouts = state.workouts.map((w) => {
        if (w.id !== workoutId) return w;
        const exercises = [...w.exercises];
        exercises.splice(idx, 1);
        return { ...w, exercises };
      });
      state.workouts = workouts;
      render();
    })
  );
  app.querySelectorAll("[data-move]").forEach((el) =>
    el.addEventListener("click", () => {
      const [idxStr, dirStr] = el.getAttribute("data-move").split(":");
      const idx = Number(idxStr), dir = Number(dirStr);
      const workoutId = location.hash.split("/")[2];
      const workouts = state.workouts.map((w) => {
        if (w.id !== workoutId) return w;
        const exercises = [...w.exercises];
        const newIdx = idx + dir;
        if (newIdx < 0 || newIdx >= exercises.length) return w;
        [exercises[idx], exercises[newIdx]] = [exercises[newIdx], exercises[idx]];
        return { ...w, exercises };
      });
      state.workouts = workouts;
      render();
    })
  );
  const wNameInput = app.querySelector("#w-name");
  if (wNameInput) wNameInput.addEventListener("change", () => {
    const id = wNameInput.getAttribute("data-workout-id");
    state.workouts = state.workouts.map((w) => (w.id === id ? { ...w, name: wNameInput.value } : w));
  });
  const wDayInput = app.querySelector("#w-day");
  if (wDayInput) wDayInput.addEventListener("change", () => {
    const id = wDayInput.getAttribute("data-workout-id");
    state.workouts = state.workouts.map((w) => (w.id === id ? { ...w, day: wDayInput.value } : w));
  });

  app.querySelectorAll("[data-sets]").forEach((el) =>
    el.addEventListener("click", () => {
      const [idxStr, deltaStr] = el.getAttribute("data-sets").split(":");
      const idx = Number(idxStr), delta = Number(deltaStr);
      const workoutId = location.hash.split("/")[2];
      const workouts = state.workouts.map((w) => {
        if (w.id !== workoutId) return w;
        const exercises = w.exercises.map((we, i) =>
          i === idx ? { ...we, sets: Math.max(1, (we.sets || 1) + delta) } : we
        );
        return { ...w, exercises };
      });
      state.workouts = workouts;
      render();
    })
  );
  app.querySelectorAll("[data-rest]").forEach((el) =>
    el.addEventListener("click", () => {
      const [idxStr, deltaStr] = el.getAttribute("data-rest").split(":");
      const idx = Number(idxStr), delta = Number(deltaStr);
      const workoutId = location.hash.split("/")[2];
      const workouts = state.workouts.map((w) => {
        if (w.id !== workoutId) return w;
        const exercises = w.exercises.map((we, i) =>
          i === idx ? { ...we, restSeconds: Math.max(0, we.restSeconds + delta) } : we
        );
        return { ...w, exercises };
      });
      state.workouts = workouts;
      render();
    })
  );
  const delWorkoutBtn = app.querySelector("[data-delete-workout]");
  if (delWorkoutBtn) delWorkoutBtn.addEventListener("click", () => {
    const id = delWorkoutBtn.getAttribute("data-delete-workout");
    state.workouts = state.workouts.filter((w) => w.id !== id);
    navigate("#/");
  });

  // Player
  const completeBtn = app.querySelector("[data-complete]");
  if (completeBtn) completeBtn.addEventListener("click", () => startRest(Number(completeBtn.getAttribute("data-complete"))));
  const prevBtn = app.querySelector("[data-prev]");
  if (prevBtn) prevBtn.addEventListener("click", () => { playerState.index = Math.max(playerState.index - 1, 0); playerState.setIndex = 0; render(); });
  const nextBtn = app.querySelector("[data-next]");
  if (nextBtn) nextBtn.addEventListener("click", skipToNextExercise);
  const addTimeBtn = app.querySelector("[data-add-time]");
  if (addTimeBtn) addTimeBtn.addEventListener("click", () => { playerState.seconds += 30; document.getElementById("timerDisplay").textContent = playerState.seconds; });
  const skipBtn = app.querySelector("[data-skip-rest]");
  if (skipBtn) skipBtn.addEventListener("click", goNext);

  // Admin — color
  const personNameInput = app.querySelector("#personNameInput");
  if (personNameInput) personNameInput.addEventListener("change", () => {
    state.settings = { ...state.settings, personName: personNameInput.value.trim() };
  });

  app.querySelectorAll("[data-color]").forEach((el) =>
    el.addEventListener("click", () => {
      state.settings = { ...state.settings, accentColor: el.getAttribute("data-color") };
      render();
    })
  );
  const colorInput = app.querySelector("#colorInput");
  if (colorInput) colorInput.addEventListener("input", (e) => {
    state.settings = { ...state.settings, accentColor: e.target.value };
    applyTheme();
  });
  colorInput && colorInput.addEventListener("change", () => render());

  app.querySelectorAll("[data-dow]").forEach((el) =>
    el.addEventListener("change", () => {
      const dow = el.getAttribute("data-dow");
      const schedule = { ...state.plan.schedule, [dow]: el.value };
      state.plan = { ...state.plan, schedule };
    })
  );

  const exportBtn = app.querySelector("#exportBtn");
  if (exportBtn) exportBtn.addEventListener("click", exportData);

  // Admin — exercises CRUD
  const newExBtn = app.querySelector("#newExBtn");
  if (newExBtn) newExBtn.addEventListener("click", () => {
    document.getElementById("exerciseFormWrap").innerHTML = exerciseFormHtml(null);
    attachFormHandlers(null);
  });
  app.querySelectorAll("[data-edit-ex]").forEach((el) =>
    el.addEventListener("click", () => {
      const ex = findExercise(el.getAttribute("data-edit-ex"));
      document.getElementById("exerciseFormWrap").innerHTML = exerciseFormHtml(ex);
      attachFormHandlers(ex);
    })
  );
  app.querySelectorAll("[data-remove-ex]").forEach((el) =>
    el.addEventListener("click", () => {
      const id = el.getAttribute("data-remove-ex");
      state.exercises = state.exercises.filter((e) => e.id !== id);
      render();
    })
  );
}

function attachFormHandlers(existing) {
  const wrap = document.getElementById("exerciseFormWrap");
  wrap.querySelector("#f-cancel").addEventListener("click", () => (wrap.innerHTML = ""));
  wrap.querySelector("#f-save").addEventListener("click", () => {
    const id = wrap.querySelector("#f-save").getAttribute("data-id");
    const updated = {
      id,
      name: wrap.querySelector("#f-name").value,
      category: wrap.querySelector("#f-category").value,
      primaryMuscle: wrap.querySelector("#f-muscle").value,
      secondaryMuscles: wrap.querySelector("#f-secondary").value.split(",").map((s) => s.trim()).filter(Boolean),
      difficulty: existing ? existing.difficulty : "beginner",
      notes: wrap.querySelector("#f-notes").value,
      gif: wrap.querySelector("#f-gif").value,
      thumbnail: existing ? existing.thumbnail : "",
    };
    const exists = state.exercises.some((e) => e.id === id);
    state.exercises = exists
      ? state.exercises.map((e) => (e.id === id ? updated : e))
      : [...state.exercises, updated];
    render();
  });
}
