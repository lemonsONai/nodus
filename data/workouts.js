/*
  Templates de treino do Nodus.
  "exercises" é a lista ordenada de ids de exercícios (ver exercises.js):
  - restSeconds: descanso em segundos depois de cada série
  - sets: nº de séries desse exercício (ex: 4 = faz 4 vezes, com descanso
    entre cada, antes de passar ao exercício seguinte). Omitir = 1 série.
  "day" é uma etiqueta livre (ex: "A") usada só para agrupar treinos
  visualmente no Início — não tem lógica de calendário associada.
*/
window.NODUS_DATA = window.NODUS_DATA || {};
window.NODUS_DATA.workouts = [
  {
    id: "wo-push",
    name: "Push",
    day: "A",
    category: "strength",
    exercises: [
      { exerciseId: "ex-002", restSeconds: 60, sets: 4 },
      { exerciseId: "ex-009", restSeconds: 60, sets: 4 },
      { exerciseId: "ex-003", restSeconds: 60, sets: 3 },
      { exerciseId: "ex-004", restSeconds: 45, sets: 3 }
    ]
  },
  {
    id: "wo-pull",
    name: "Pull",
    day: "B",
    category: "strength",
    exercises: [
      { exerciseId: "ex-001", restSeconds: 60, sets: 4 },
      { exerciseId: "ex-010", restSeconds: 60, sets: 3 }
    ]
  },
  {
    id: "wo-legs",
    name: "Legs",
    day: "C",
    category: "strength",
    exercises: [
      { exerciseId: "ex-005", restSeconds: 75, sets: 4 },
      { exerciseId: "ex-006", restSeconds: 75, sets: 4 },
      { exerciseId: "ex-007", restSeconds: 60, sets: 3 },
      { exerciseId: "ex-008", restSeconds: 45, sets: 3 }
    ]
  },
  {
    id: "wo-shoulders-core",
    name: "Shoulders & Core",
    day: "D",
    category: "strength",
    exercises: [
      { exerciseId: "ex-003", restSeconds: 60, sets: 4 },
      { exerciseId: "ex-010", restSeconds: 60, sets: 3 },
      { exerciseId: "ex-004", restSeconds: 45, sets: 3 },
      { exerciseId: "ex-008", restSeconds: 45, sets: 3 }
    ]
  },
  {
    id: "wo-full-body",
    name: "Full body",
    day: "E",
    category: "strength",
    exercises: [
      { exerciseId: "ex-005", restSeconds: 75, sets: 3 },
      { exerciseId: "ex-002", restSeconds: 60, sets: 3 },
      { exerciseId: "ex-001", restSeconds: 60, sets: 3 },
      { exerciseId: "ex-007", restSeconds: 60, sets: 3 }
    ]
  },
  {
    id: "wo-yoga-morning",
    name: "Yoga matinal",
    category: "yoga",
    exercises: [
      { exerciseId: "yg-004", restSeconds: 15, sets: 1 },
      { exerciseId: "yg-001", restSeconds: 15, sets: 1 },
      { exerciseId: "yg-003", restSeconds: 20, sets: 1 },
      { exerciseId: "yg-005", restSeconds: 15, sets: 1 },
      { exerciseId: "yg-002", restSeconds: 20, sets: 1 }
    ]
  }
];
