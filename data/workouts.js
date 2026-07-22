/*
  Templates de treino do Nodus — estrutura por FASES.

  Cada treino tem "phases": uma sequência ordenada (ex: Primary Lift →
  Pull → Stability). Cada fase tem:
  - label: nome mostrado no Player (ex: "Primary Lift")
  - sets / restSeconds: como antes
  - pool: lista de ids de exercícios que servem essa fase. Se puseres
    mais que um, a app roda automaticamente entre eles a cada sessão
    (não repete sempre o mesmo) — vê README para detalhes.

  "day" é uma etiqueta livre (ex: "A") usada para agrupar treinos no
  Início/Plano — não tem lógica de calendário associada.
*/
window.NODUS_DATA = window.NODUS_DATA || {};
window.NODUS_DATA.workouts = [
  {
    id: "wo-push",
    name: "Push",
    day: "A",
    category: "strength",
    phases: [
      { id: "ph-push-primary", label: "Primary Lift", sets: 4, restSeconds: 60, pool: ["ex-002", "ex-009"] },
      { id: "ph-push-pull", label: "Pull", sets: 3, restSeconds: 60, pool: ["ex-001", "ex-010"] },
      { id: "ph-push-stability", label: "Stability", sets: 3, restSeconds: 45, pool: ["ex-004"] }
    ]
  },
  {
    id: "wo-pull",
    name: "Pull",
    day: "B",
    category: "strength",
    phases: [
      { id: "ph-pull-primary", label: "Primary Pull", sets: 4, restSeconds: 60, pool: ["ex-001"] },
      { id: "ph-pull-secondary", label: "Secondary Pull", sets: 3, restSeconds: 60, pool: ["ex-010"] }
    ]
  },
  {
    id: "wo-legs",
    name: "Legs",
    day: "C",
    category: "strength",
    phases: [
      { id: "ph-legs-primary", label: "Primary Lift", sets: 4, restSeconds: 75, pool: ["ex-005", "ex-006"] },
      { id: "ph-legs-accessory", label: "Accessory", sets: 3, restSeconds: 60, pool: ["ex-007"] },
      { id: "ph-legs-isolation", label: "Isolation", sets: 3, restSeconds: 45, pool: ["ex-008"] }
    ]
  },
  {
    id: "wo-shoulders-core",
    name: "Shoulders & Core",
    day: "D",
    category: "strength",
    phases: [
      { id: "ph-sc-primary", label: "Primary Lift", sets: 4, restSeconds: 60, pool: ["ex-003"] },
      { id: "ph-sc-pull", label: "Pull", sets: 3, restSeconds: 60, pool: ["ex-010"] },
      { id: "ph-sc-stability", label: "Stability", sets: 3, restSeconds: 45, pool: ["ex-004"] },
      { id: "ph-sc-isolation", label: "Isolation", sets: 3, restSeconds: 45, pool: ["ex-008"] }
    ]
  },
  {
    id: "wo-full-body",
    name: "Full body",
    day: "E",
    category: "strength",
    phases: [
      { id: "ph-fb-primary", label: "Primary Lift", sets: 3, restSeconds: 75, pool: ["ex-005"] },
      { id: "ph-fb-push", label: "Push", sets: 3, restSeconds: 60, pool: ["ex-002"] },
      { id: "ph-fb-pull", label: "Pull", sets: 3, restSeconds: 60, pool: ["ex-001"] },
      { id: "ph-fb-accessory", label: "Accessory", sets: 3, restSeconds: 60, pool: ["ex-007"] }
    ]
  },
  {
    id: "wo-yoga-morning",
    name: "Yoga matinal",
    category: "yoga",
    phases: [
      { id: "ph-yg-warmup", label: "Aquecimento", sets: 1, restSeconds: 15, pool: ["yg-004"] },
      { id: "ph-yg-stretch", label: "Alongamento", sets: 1, restSeconds: 15, pool: ["yg-001"] },
      { id: "ph-yg-balance", label: "Equilíbrio", sets: 1, restSeconds: 20, pool: ["yg-003"] },
      { id: "ph-yg-twist", label: "Torção", sets: 1, restSeconds: 15, pool: ["yg-005"] },
      { id: "ph-yg-relax", label: "Relaxamento", sets: 1, restSeconds: 20, pool: ["yg-002"] }
    ]
  }
];
