import PresidentsTab from "../components/PresidentsTab";
import AttractionsTab from "../components/AttractionsTab";
import { useState } from "react";
import AirportsTab from "../components/AirportsTab";

function Home() {
  const [activeTab, setActiveTab] = useState("tab1");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  return (
    <>
      <h1>API COLOMBIA</h1>
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "tab1" ? "active" : ""}`}
          onClick={() => handleTabClick("tab1")}
        >
          Presidentes
        </button>
        <button
          className={`tab-button ${activeTab === "tab2" ? "active" : ""}`}
          onClick={() => handleTabClick("tab2")}
        >
          Atracciones turísticas
        </button>
        <button
          className={`tab-button ${activeTab === "tab3" ? "active" : ""}`}
          onClick={() => handleTabClick("tab3")}
        >
          Aeropuertos
        </button>
        <button
          className={`tab-button ${activeTab === "tab4" ? "active" : ""}`}
          onClick={() => handleTabClick("tab4")}
        >
          Aeropuertos
        </button>
      </div>
      <div className="tab-content">
        {activeTab === "tab1" && <PresidentsTab />}
        {activeTab === "tab2" && <AttractionsTab />}
        {activeTab === "tab3" && <AirportsTab />}
      </div>
    </>
  );
}

export default Home;
