import { useState, useEffect } from "react";
import PresidentsTable from "./PresidentsTable";

function PresidentsTab() {
  const [presidentsData, setPresidentsData] = useState([]);
  const [filteredPresidents, setFilteredPresidents] = useState([]);
  const [groupedParties, setGroupedParties] = useState([]);

  useEffect(() => {
    fetchPresidentsData();
  }, []);

  useEffect(() => {
    console.log(presidentsData);
    if (presidentsData.length) {
      const parties = getUniqueParties(presidentsData);
      setGroupedParties(parties);
      setFilteredPresidents(presidentsData);
      console.log(groupedParties);
    }
  }, [presidentsData]);

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

  const handlePartyFilter = (e) => {
    console.log(e.target.value);
    const filtered = presidentsData.filter(
      (president) => president.politicalParty === e.target.value
    );
    setFilteredPresidents(filtered);
  };

  const fetchPresidentsData = async () => {
    try {
      const response = await fetch("https://api-colombia.com/api/v1/President");
      const presidentsData = await response.json();
      setPresidentsData(presidentsData.sort((a, b) => a.id - b.id));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
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
      <p>{presidentsData.length} presidentes encontrados</p>
      <PresidentsTable filteredPresidents={filteredPresidents} />
    </div>
  );
}

export default PresidentsTab;
