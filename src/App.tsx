import { useState } from "react";
import { McPiTab } from "./components/McPiTab";
import { Gen3dTab } from "./components/Gen3dTab";
import { QueueTab } from "./components/QueueTab";
import { StockTab } from "./components/StockTab";
import { PortfolioTab } from "./components/PortfolioTab";
import { BoxMullerTab } from "./components/BoxMullerTab";
import { McIntTab } from "./components/McIntTab";
import { BirthdayTab } from "./components/BirthdayTab";

export type MainTab =
  | "mc_pi"
  | "queue"
  | "stock"
  | "portfolio"
  | "bm"
  | "mc_int"
  | "bd"
  | "gen3d";

const TAB_LABELS: { id: MainTab; label: string }[] = [
  { id: "mc_pi", label: "π Estimation" },
  { id: "queue", label: "Queue" },
  { id: "stock", label: "(s, S) Inventory" },
  { id: "portfolio", label: "Portfolio" },
  { id: "bm", label: "Box–Muller" },
  { id: "mc_int", label: "MC Integration" },
  { id: "bd", label: "Birthday" },
  { id: "gen3d", label: "3D Visualization" },
];

export default function App() {
  const [mainTab, setMainTab] = useState<MainTab>("mc_pi");

  return (
    <div className="app-shell">
      <header className="app-banner">
        <h1 className="app-title">ISyE 6644 Baby Simulations</h1>
      </header>

      <main className="app-main">
        <nav className="nav-pills app-main-tabs" aria-label="Demo modules">
          {TAB_LABELS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={mainTab === id ? "nav-pill active" : "nav-pill"}
              onClick={() => setMainTab(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        {mainTab === "mc_pi" && <McPiTab />}
        {mainTab === "gen3d" && <Gen3dTab />}
        {mainTab === "queue" && <QueueTab />}
        {mainTab === "stock" && <StockTab />}
        {mainTab === "portfolio" && <PortfolioTab />}
        {mainTab === "bm" && <BoxMullerTab />}
        {mainTab === "mc_int" && <McIntTab />}
        {mainTab === "bd" && <BirthdayTab />}
      </main>
    </div>
  );
}
