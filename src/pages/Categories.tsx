import { useNavigate } from "react-router-dom";
import { TopBar } from "../components/Layout";
import { IconBarbell, IconYoga, IconClose, IconPlus } from "../components/Icons";
import type { Category } from "../types";

const CATS: { id: Category; label: string; Icon: React.ComponentType }[] = [
  { id: "strength", label: "Força", Icon: IconBarbell },
  { id: "yoga", label: "Yoga", Icon: IconYoga },
  { id: "mobility", label: "Mobilidade", Icon: IconYoga },
  { id: "custom", label: "Personalizado", Icon: IconPlus },
];

export function Categories() {
  const nav = useNavigate();
  return (
    <div>
      <TopBar label="Categorias" right={<a href="#/"><IconClose /></a>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CATS.map(({ id, label, Icon }) => (
          <div
            key={id}
            onClick={() => nav(`/categoria/${id}`)}
            className="aspect-square rounded-[20px] bg-white/[0.04] border border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer text-white/85"
          >
            <Icon />
            <span className="text-sm">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
