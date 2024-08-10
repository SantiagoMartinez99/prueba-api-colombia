import { useEffect, useState } from "react";
import "./index.css";
import PresidentsTable from "./components/PresidentsTable";

function App() {
  const [activeTab, setActiveTab] = useState("tab1");
  const [data, setData] = useState({
    presidents: [],
    attractions: [],
    airports: [],
  });
  const [filteredPresidents, setFilteredPresidents] = useState([]);
  const [groupedParties, setGroupedParties] = useState([]);
  // const [selectedParty, setSelectedParty] = useState("");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    fetchPresidentsData();
  }, []);

  useEffect(() => {
    if (data.presidents.length) {
      const parties = getUniqueParties(data.presidents);
      setGroupedParties(parties);
      setFilteredPresidents(data.presidents);
      console.log(groupedParties);
    }
  }, [data]);

  const getUniqueParties = (presidents) => {
    const parties = [
      ...new Set(presidents.map((president) => president.politicalParty)),
    ];
    return parties
      .map((party) => ({
        name: party,
        count: presidents.filter(
          (president) => president.politicalParty === party
        ).length,
      }))
      .sort((a, b) => b.count - a.count);
  };

  const fetchPresidentsData = async () => {
    try {
      const [presidentsResponse, attractionsResponse, airportsResponse] =
        await Promise.all([
          fetch("https://api-colombia.com/api/v1/President"),
          fetch("https://api-colombia.com/api/v1/TouristicAttraction"),
          fetch("https://api-colombia.com/api/v1/Airport"),
        ]);

      const presidentsData = await presidentsResponse.json();
      const attractionsData = await attractionsResponse.json();
      const airportsData = await airportsResponse.json();

      setData({
        presidents: presidentsData.sort((a, b) => a.id - b.id),
        attractions: attractionsData.sort((a, b) => a.id - b.id),
        airports: airportsData.sort((a, b) => a.id - b.id),
      });
      console.log("Presidents Data:", presidentsData.length);
      console.log("Touristic Attractions Data:", attractionsData.length);
      console.log("Airports Data:", airportsData.length);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePartyFilter = (e) => {
    console.log(e.target.value);
    const filtered = data.presidents.filter(
      (president) => president.politicalParty === e.target.value
    );
    setFilteredPresidents(filtered);
  };

  // const fetchData3 = async () => {
  //   try {
  //     const response = await fetch(
  //       "https://api-colombia.com/api/v1/Airport"
  //     );
  //     const data = await response.json();
  //     console.log(data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

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
        {activeTab === "tab1" && data.presidents.length && (
          <div>
            <p>Filtrar por partido:</p>
            <select onChange={handlePartyFilter}>
              {groupedParties.map((party) => (
                <option key={party.name} value={party.name}>
                  {party.name} ({party.count} presidentes)
                </option>
              ))}
            </select>
            <p>Eliminar Filtros</p>
            <p>{data.presidents.length} presidentes encontrados</p>
            <PresidentsTable filteredPresidents={filteredPresidents} />
          </div>
        )}
        {activeTab === "tab2" && <div>Content for Tab 2</div>}
        {activeTab === "tab3" && <div>Content for Tab 3</div>}
      </div>
    </>
  );
}

export default App;
