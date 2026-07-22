/*
  Lista de exercícios do Nodus.

  COMO EDITAR:
  - Copia um bloco { ... } inteiro para criares um exercício novo.
  - "gif" e "thumbnail" são caminhos relativos à pasta assets/.
  - "gif" pode ser .gif, .mp4 ou .webm (o player escolhe <img> ou <video>
    automaticamente pela extensão).
  - category: "strength" | "yoga" | "mobility" | "custom"
  - difficulty: "beginner" | "intermediate" | "advanced"
  Depois de editares, basta guardar o ficheiro e recarregar a app.
*/
window.NODUS_DATA = window.NODUS_DATA || {};
window.NODUS_DATA.exercises = [
  {
    id: "ex-001",
    name: "Dumbbell row",
    category: "strength",
    primaryMuscle: "Costas",
    secondaryMuscles: ["Bíceps"],
    difficulty: "beginner",
    notes: "Mantém as costas neutras, puxa o cotovelo para trás sem rodar o tronco.",
    gif: "assets/exercises/dumbbell-row.gif",
    thumbnail: "assets/thumbnails/dumbbell-row.webp"
  },
  {
    id: "ex-002",
    name: "Push-up",
    category: "strength",
    primaryMuscle: "Peito",
    secondaryMuscles: ["Tríceps", "Core"],
    difficulty: "beginner",
    notes: "Mãos ligeiramente mais largas que os ombros, corpo em linha reta.",
    gif: "assets/exercises/push-up.mp4",
    thumbnail: "assets/thumbnails/push-up.webp"
  },
  {
    id: "ex-003",
    name: "Shoulder press",
    category: "strength",
    primaryMuscle: "Ombros",
    secondaryMuscles: ["Tríceps"],
    difficulty: "intermediate",
    notes: "Cotovelos ligeiramente à frente do corpo, não bloquear no topo.",
    gif: "assets/exercises/shoulder-press.gif",
    thumbnail: "assets/thumbnails/shoulder-press.webp"
  },
  {
    id: "ex-004",
    name: "Plank",
    category: "strength",
    primaryMuscle: "Core",
    secondaryMuscles: [],
    difficulty: "beginner",
    notes: "Corpo em linha reta, sem deixar a anca cair.",
    gif: "assets/exercises/plank.gif",
    thumbnail: "assets/thumbnails/plank.webp"
  },
  {
    id: "ex-005",
    name: "Agachamento (Squat)",
    category: "strength",
    primaryMuscle: "Quadríceps",
    secondaryMuscles: ["Glúteos", "Core"],
    difficulty: "beginner",
    notes: "Joelhos alinhados com os pés, desce até às coxas ficarem paralelas ao chão.",
    gif: "assets/exercises/squat.gif",
    thumbnail: "assets/thumbnails/squat.webp"
  },
  {
    id: "ex-006",
    name: "Elevação pélvica (Hip thrust)",
    category: "strength",
    primaryMuscle: "Glúteos",
    secondaryMuscles: ["Isquiotibiais"],
    difficulty: "beginner",
    notes: "Empurra através dos calcanhares, aperta os glúteos no topo.",
    gif: "assets/exercises/hip-thrust.gif",
    thumbnail: "assets/thumbnails/hip-thrust.webp"
  },
  {
    id: "ex-007",
    name: "Afundo (Lunge)",
    category: "strength",
    primaryMuscle: "Quadríceps",
    secondaryMuscles: ["Glúteos"],
    difficulty: "intermediate",
    notes: "Tronco direito, joelho da frente não ultrapassa a ponta do pé.",
    gif: "assets/exercises/lunge.gif",
    thumbnail: "assets/thumbnails/lunge.webp"
  },
  {
    id: "ex-008",
    name: "Elevação de gémeos (Calf raise)",
    category: "strength",
    primaryMuscle: "Gémeos",
    secondaryMuscles: [],
    difficulty: "beginner",
    notes: "Sobe até à ponta dos pés, controla a descida devagar.",
    gif: "assets/exercises/calf-raise.gif",
    thumbnail: "assets/thumbnails/calf-raise.webp"
  },
  {
    id: "ex-009",
    name: "Chest press",
    category: "strength",
    primaryMuscle: "Peito",
    secondaryMuscles: ["Tríceps", "Ombros"],
    difficulty: "beginner",
    notes: "Cotovelos a 45º do tronco, não bloquear no topo.",
    gif: "assets/exercises/chest-press.gif",
    thumbnail: "assets/thumbnails/chest-press.webp"
  },
  {
    id: "ex-010",
    name: "Face pull",
    category: "strength",
    primaryMuscle: "Ombros",
    secondaryMuscles: ["Costas"],
    difficulty: "intermediate",
    notes: "Puxa em direção à cara, cotovelos altos, aperta as omoplatas.",
    gif: "assets/exercises/face-pull.gif",
    thumbnail: "assets/thumbnails/face-pull.webp"
  },
  {
    id: "yg-001",
    name: "Cão olhando para baixo",
    category: "yoga",
    primaryMuscle: "Corpo inteiro",
    secondaryMuscles: ["Isquiotibiais", "Ombros"],
    difficulty: "beginner",
    notes: "Calcanhares em direção ao chão, alonga a coluna, respira devagar.",
    gif: "assets/yoga/downward-dog.gif",
    thumbnail: "assets/thumbnails/downward-dog.webp"
  },
  {
    id: "yg-002",
    name: "Postura da criança",
    category: "yoga",
    primaryMuscle: "Costas",
    secondaryMuscles: ["Anca"],
    difficulty: "beginner",
    notes: "Testa no chão, braços estendidos ou ao lado do corpo, respira fundo.",
    gif: "assets/yoga/child-pose.gif",
    thumbnail: "assets/thumbnails/child-pose.webp"
  },
  {
    id: "yg-003",
    name: "Guerreiro II",
    category: "yoga",
    primaryMuscle: "Pernas",
    secondaryMuscles: ["Core", "Ombros"],
    difficulty: "intermediate",
    notes: "Joelho da frente alinhado com o tornozelo, braços paralelos ao chão.",
    gif: "assets/yoga/warrior-2.gif",
    thumbnail: "assets/thumbnails/warrior-2.webp"
  },
  {
    id: "yg-004",
    name: "Postura do gato-vaca",
    category: "yoga",
    primaryMuscle: "Coluna",
    secondaryMuscles: ["Core"],
    difficulty: "beginner",
    notes: "Alterna entre arquear e arredondar as costas, sincroniza com a respiração.",
    gif: "assets/yoga/cat-cow.gif",
    thumbnail: "assets/thumbnails/cat-cow.webp"
  },
  {
    id: "yg-005",
    name: "Torção sentada",
    category: "yoga",
    primaryMuscle: "Coluna",
    secondaryMuscles: ["Core", "Anca"],
    difficulty: "beginner",
    notes: "Roda a partir da base da coluna, mantém a espinha longa.",
    gif: "assets/yoga/seated-twist.gif",
    thumbnail: "assets/thumbnails/seated-twist.webp"
  }
];
