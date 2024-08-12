import { useState, useEffect } from "react";
import PresidentsTable from "./PresidentsTable";

function PresidentsTab() {
  const [presidentsData, setPresidentsData] = useState([]);
  const [filteredPresidents, setFilteredPresidents] = useState([]);
  const [groupedParties, setGroupedParties] = useState([]);
  const [fetchTime, setFetchTime] = useState(0);

  useEffect(() => {
    fetchPresidentsData();
  }, []);

  useEffect(() => {
    if (presidentsData.length) {
      const parties = getUniqueParties(presidentsData);
      setGroupedParties(parties);
      setFilteredPresidents(presidentsData);
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
    const filtered = presidentsData.filter(
      (president) => president.politicalParty === e.target.value
    );
    setFilteredPresidents(filtered);
  };

  const fetchPresidentsData = async () => {
    try {
      const startTime = performance.now();
      const [responsePresidents, responseCities] = await Promise.all([
        fetch("https://api-colombia.com/api/v1/President"),
        fetch("https://api-colombia.com/api/v1/City"),
      ]);

      const presidentsData = await responsePresidents.json();
      const citiesData = await responseCities.json();

      const citiesMap = new Map(citiesData.map((city) => [city.id, city]));

      const combinedData = presidentsData.map((president) => {
        const city = citiesMap.get(president.cityId);
        return {
          ...president,
          cityName: city?.name || "Desconocida",
        };
      });

      setPresidentsData(combinedData.sort((a, b) => a.id - b.id));
      const endTime = performance.now();
      setFetchTime((endTime - startTime) / 1000);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="container-tab">
      <p>Filtrar por partido:</p>
      <select onChange={handlePartyFilter} className="select-filters">
        <option value="" hidden>
          Seleccione una opción
        </option>
        {groupedParties.map((party) => (
          <option key={party.name} value={party.name}>
            {party.name} ({party.count} presidentes)
          </option>
        ))}
      </select>
      <p
        onClick={() => setFilteredPresidents(presidentsData)}
        className="button-clear-filters"
      >
        Eliminar Filtros
      </p>
      <p>{filteredPresidents.length} presidentes encontrados</p>
      <p>Realizado en {fetchTime} segundos</p>
      <PresidentsTable filteredPresidents={filteredPresidents} />
    </div>
  );
}

export default PresidentsTab;
