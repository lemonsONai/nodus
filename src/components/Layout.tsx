import { NavLink, Outlet } from "react-router-dom";
import { IconHome, IconCalendar, IconGrid, IconManage, IconSettings } from "./Icons";

const NAV = [
  { to: "/", label: "Início", Icon: IconHome, end: true },
  { to: "/plano", label: "Plano", Icon: IconCalendar, end: false },
  { to: "/categorias", label: "Categorias", Icon: IconGrid, end: false },
  { to: "/gerir", label: "Gerir", Icon: IconManage, end: false },
  { to: "/admin", label: "Admin", Icon: IconSettings, end: false },
];

export function Layout() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-[420px] md:max-w-[1080px] px-5 pt-6 pb-24 md:pb-12 md:pt-24 md:px-12 relative">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto h-[68px] md:h-16 bg-black/90 backdrop-blur border-t md:border-t-0 md:border-b border-white/10 flex items-center justify-around md:justify-center md:gap-10 max-w-[420px] md:max-w-none mx-auto z-40">
        {NAV.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col md:flex-row items-center gap-1.5 md:gap-2 text-[10px] md:text-[13px] no-underline ${
                isActive ? "text-white" : "text-white/30"
              }`
            }
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function TopBar({ label, right }: { label?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <img
          src={`${import.meta.env.BASE_URL}assets/branding/logo.png`}
          alt="Nodus"
          style={{ height: label ? 14 : 22 }}
        />
        {label && <span className="text-white/50 text-[13px]">{label}</span>}
      </div>
      {right}
    </div>
  );
}
