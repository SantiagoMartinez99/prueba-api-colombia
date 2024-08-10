import { useState } from "react";
import "./index.css";
import PresidentsTab from "./components/PresidentsTab";
import AttractionsTab from "./components/AttractionsTab";


function App() {
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
          Tab 1
        </button>
        <button
          className={`tab-button ${activeTab === "tab2" ? "active" : ""}`}
          onClick={() => handleTabClick("tab2")}
        >
          Tab 2
        </button>
        <button
          className={`tab-button ${activeTab === "tab3" ? "active" : ""}`}
          onClick={() => handleTabClick("tab3")}
        >
          Tab 3
        </button>
      </div>
      <div className="tab-content">
        {activeTab === "tab1" && <PresidentsTab />}
        {activeTab === "tab2" && <AttractionsTab />}
        {activeTab === "tab3" && <div>Content for Tab 3</div>}
      </div>
    </>
  );
}

export default App;
