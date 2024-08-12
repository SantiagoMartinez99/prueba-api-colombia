import { useState, useEffect } from "react";
import AttractionsTable from "./AttractionsTable";

function AttractionsTab() {
  const [attractionsData, setAttractionsData] = useState([]);
  const [filteredAttractions, setFilteredAttractions] = useState([]);
  const [groupedDepartments, setGroupedDepartments] = useState([]);
  const [fetchTime, setFetchTime] = useState(0);

  useEffect(() => {
    fetchAttractionsData();
  }, []);

  useEffect(() => {
    const departments = getUniqueDepartments(attractionsData);
    setGroupedDepartments(departments);
    setFilteredAttractions(attractionsData);
  }, [attractionsData]);

  const getUniqueDepartments = (attractions) => {
    const departments = [
      ...new Set(attractions.map((attraction) => attraction.departmentName)),
    ];
    return departments
      .map((departmentName) => ({
        name: departmentName,
        count: attractions.filter(
          (attraction) => attraction.departmentName === departmentName
        ).length,
      }))
      .sort((a, b) => b.count - a.count);
  };
  const fetchAttractionsData = async () => {
    try {
      const startTime = performance.now();

      const [responseAttractions, responseDepartments] = await Promise.all([
        fetch("https://api-colombia.com/api/v1/TouristicAttraction"),
        fetch("https://api-colombia.com/api/v1/Department"),
      ]);

      const attractionsData = await responseAttractions.json();
      const departmentsData = await responseDepartments.json();

      const departmentsMap = new Map(
        departmentsData.map((department) => [department.id, department])
      );

      const combinedData = attractionsData.map((attraction) => {
        const department = departmentsMap.get(attraction.city.departmentId);
        return {
          ...attraction,
          departmentName: department?.name || "Unknown Department",
        };
      });

      setAttractionsData(combinedData.sort((a, b) => a.id - b.id));
      const endTime = performance.now();
      setFetchTime((endTime - startTime) / 1000);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAttractionFilter = (e) => {
    const departmentName = e.target.value;
    const filtered = attractionsData.filter(
      (attraction) => attraction.departmentName === departmentName
    );
    setFilteredAttractions(filtered);
  };
  return (
    <div className="container-tab">
      <p>Filtrar por departamento:</p>
      <select onChange={handleAttractionFilter} className="select-filters">
        <option value="" hidden>
          Seleccione una opción
        </option>
        {groupedDepartments.map((department) => (
          <option key={department.id} value={department.name}>
            {department.name} ({department.count} atracciones)
          </option>
        ))}
      </select>
      <p
        onClick={() => setFilteredAttractions(attractionsData)}
        className="button-clear-filters"
      >
        Eliminar Filtros
      </p>
      <p>{filteredAttractions.length} atracciones encontrados</p>
      <p>Realizado en {fetchTime} segundos</p>
      <AttractionsTable filteredAttractions={filteredAttractions} />
    </div>
  );
}

export default AttractionsTab;
