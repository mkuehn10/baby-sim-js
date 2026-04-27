import { useState } from "react";
import { McPiTab } from "./components/McPiTab";
import { Gen3dTab } from "./components/Gen3dTab";

type MainTab = "mc_pi" | "gen3d";

export default function App() {
  const [mainTab, setMainTab] = useState<MainTab>("mc_pi");

  return (
    <div className="app-shell">
      <header className="app-banner">
        <h1 className="app-title">ISyE 6644 Baby Simulations</h1>
      </header>

      <main className="app-main">
        <nav className="nav-pills app-main-tabs" aria-label="Demo modules">
          <button
            type="button"
            className={mainTab === "mc_pi" ? "nav-pill active" : "nav-pill"}
            onClick={() => setMainTab("mc_pi")}
          >
            π Estimation
          </button>
          <button
            type="button"
            className={mainTab === "gen3d" ? "nav-pill active" : "nav-pill"}
            onClick={() => setMainTab("gen3d")}
          >
            3D Visualization
          </button>
        </nav>

        {mainTab === "mc_pi" && <McPiTab />}
        {mainTab === "gen3d" && <Gen3dTab />}
      </main>
    </div>
  );
}
