import { TopBar } from "../components/Layout";
import { IconClose } from "../components/Icons";

const CHANGELOG = [
  "Categorias com treinos e pools de exercícios (rotação automática)",
  "Player com navegação livre entre treinos e lista de estado (pendente/feito/ignorado)",
  "Plano semanal/mensal com calendário",
  "Histórico de sessões por pessoa, com exportar/importar e fusão automática",
  "Sincronização em tempo real com o GitHub",
  "Reescrito em React + TypeScript para maior robustez",
];

const FAQS = [
  {
    q: "Categoria, treino, o que é o quê?",
    a: 'Categoria (ex: "Upper Body Strength") é o que escolhes para treinar. Dentro dela, tens vários treinos (ex: "Primary Lift") — cada um pode ter várias opções de exercício, e a app roda entre elas a cada sessão.',
  },
  {
    q: "Como faço backup e sincronizo entre dispositivos?",
    a: "Em Admin, configura a Sincronização GitHub — todos os dispositivos com o mesmo token/repositório veem sempre os mesmos dados, em tempo real.",
  },
];

export function Info() {
  return (
    <div>
      <TopBar label="Sobre & FAQ" right={<a href="#/"><IconClose /></a>} />
      <p className="section-label mt-0">O que já existe</p>
      <div className="card p-4 mb-5">
        {CHANGELOG.map((c) => (
          <div key={c} className="flex gap-2 py-1.5">
            <span style={{ color: "var(--color-accent)" }}>✓</span>
            <span className="text-sm text-white/80">{c}</span>
          </div>
        ))}
      </div>
      <p className="section-label">Perguntas frequentes</p>
      {FAQS.map((f) => (
        <div key={f.q} className="card p-4 mb-3">
          <p className="text-sm font-semibold mb-1.5">{f.q}</p>
          <p className="text-white/50 text-xs leading-relaxed m-0">{f.a}</p>
        </div>
      ))}
    </div>
  );
}
