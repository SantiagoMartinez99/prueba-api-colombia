import { useState, useEffect } from "react";
import AirportsTable from "./AirportsTable";

function AirportsTab() {
  const [airportsData, setAirportsData] = useState([]);
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [groupedDepartments, setGroupedDepartments] = useState([]);
  const [fetchTime, setFetchTime] = useState(0);

  useEffect(() => {
    fetchAirportsData();
  }, []);

  useEffect(() => {
    const departments = getUniqueDepartments(airportsData);
    setGroupedDepartments(departments);
    setFilteredAirports(airportsData);
  }, [airportsData]);

  const getUniqueDepartments = (airports) => {
    const departments = [
      ...new Set(airports.map((airports) => airports.city.departmentId)),
    ];
    return departments
      .map((departmentId) => ({
        id: departmentId,
        name: `Departamento ${departmentId}`,
        count: airports.filter(
          (airport) => airport.city.departmentId === departmentId
        ).length,
      }))
      .sort((a, b) => b.count - a.count);
  };

  const fetchAirportsData = async () => {
    try {
      const startTime = performance.now();

      const response = await fetch("https://api-colombia.com/api/v1/Airport");
      const airportsData = await response.json();
      setAirportsData(airportsData.sort((a, b) => a.id - b.id));
      const endTime = performance.now();
      setFetchTime((endTime - startTime) / 1000);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAirportsFilter = (e) => {
    const departmentId = parseInt(e.target.value);
    const filtered = airportsData.filter(
      (attraction) => attraction.city.departmentId === departmentId
    );
    setFilteredAirports(filtered);
  };

  return (
    <div className="container-tab">
      <p>Filtrar por departamento:</p>
      <select onChange={handleAirportsFilter} className="select-filters">
        <option value="" hidden>
          Seleccione una opción
        </option>
        {groupedDepartments.map((department) => (
          <option key={department.id} value={department.id}>
            {department.name} ({department.count} atracciones)
          </option>
        ))}
      </select>
      <p
        onClick={() => setFilteredAirports(airportsData)}
        className="button-clear-filters"
      >
        Eliminar Filtros
      </p>
      <p>{filteredAirports.length} atracciones encontrados</p>
      <p>Realizado en {fetchTime} segundos</p>

      <AirportsTable filteredAirports={filteredAirports} />
    </div>
  );
}

export default AirportsTab;
