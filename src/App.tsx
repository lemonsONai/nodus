import { HashRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "./components/Layout";
import { useStore } from "./store";
import { Home } from "./pages/Home";
import { CategoryList } from "./pages/CategoryList";
import { Player } from "./pages/Player";
import { Manage } from "./pages/Manage";
import { Builder } from "./pages/Builder";
import { Admin } from "./pages/Admin";
import { Plan } from "./pages/Plan";
import { History } from "./pages/History";
import { Info } from "./pages/Info";
import { Categories } from "./pages/Categories";

function ThemeApplier() {
  const { data } = useStore();
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", data.settings.accentColor);
    document.body.className = `bg-${data.settings.backgroundStyle || "glow"}`;
  }, [data.settings.accentColor, data.settings.backgroundStyle]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ThemeApplier />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/categoria/:cat" element={<CategoryList />} />
          <Route path="/jogar/:id" element={<Player />} />
          <Route path="/editar/:idOrCat" element={<Builder />} />
          <Route path="/gerir" element={<Manage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/plano" element={<Plan />} />
          <Route path="/historico" element={<History />} />
          <Route path="/info" element={<Info />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
