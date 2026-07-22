import { useNavigate } from "react-router-dom";

export function Home() {
  const nav = useNavigate();
  const base = import.meta.env.BASE_URL;

  return (
    <div>
      <div className="text-center pt-1 pb-5">
        <p className="text-white/55 text-[13px] mb-1.5">Bom dia</p>
        <h1 className="text-white text-3xl font-bold tracking-tight">Escolhe o teu caminho</h1>
      </div>

      <div className="flex gap-0.5 rounded-[28px] overflow-hidden h-[66vh] min-h-[420px] -mx-5 md:mx-0 mb-4">
        <div
          onClick={() => nav("/categoria/strength")}
          className="relative flex-1 cursor-pointer overflow-hidden"
        >
          <img src={`${base}assets/branding/hero-strength.jpg`} alt="Força" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "left center" }} />
        </div>
        <div
          onClick={() => nav("/categoria/yoga")}
          className="relative flex-1 cursor-pointer overflow-hidden"
        >
          <img src={`${base}assets/branding/hero-yoga.jpg`} alt="Yoga" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "right center" }} />
        </div>
      </div>

      <div className="text-center">
        <a href="#/info" className="text-white/30 text-[11px] no-underline">ⓘ Sobre &amp; FAQ</a>
      </div>
    </div>
  );
}
