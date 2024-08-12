import { useState, useEffect } from "react";
import AirportsTable from "./AirportsTable";

function AirportsTab() {
  const [airportsData, setAirportsData] = useState([]);
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [groupedDepartments, setGroupedDepartments] = useState([]);
  const [groupedCities, setGroupedCities] = useState([]);
  const [fetchTime, setFetchTime] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    fetchAirportsData();
  }, []);

  useEffect(() => {
    const departments = getUniqueDepartments(airportsData);
    const cities = getUniqueCities(airportsData);
    setGroupedDepartments(departments);
    setGroupedCities(cities);
    setFilteredAirports(airportsData);
  }, [airportsData]);

  const getUniqueDepartments = (airports) => {
    const departments = [
      ...new Set(airports.map((airport) => airport.departmentName)),
    ];
    return departments
      .map((departmentName) => ({
        name: departmentName,
        count: airports.filter(
          (airport) => airport.departmentName === departmentName
        ).length,
      }))
      .sort((a, b) => b.count - a.count);
  };

  const getUniqueCities = (airports) => {
    const cities = [...new Set(airports.map((airport) => airport.city.name))];
    return cities
      .map((cityName) => ({
        name: cityName,
        count: airports.filter((airport) => airport.city.name === cityName)
          .length,
      }))
      .sort((a, b) => b.count - a.count);
  };

  const fetchAirportsData = async () => {
    try {
      const startTime = performance.now();

      const [responseAirports, responseDepartments] = await Promise.all([
        fetch("https://api-colombia.com/api/v1/Airport"),
        fetch("https://api-colombia.com/api/v1/Department"),
      ]);
      const airportsData = await responseAirports.json();
      const departmentsData = await responseDepartments.json();
      const departmentsMap = new Map(
        departmentsData.map((department) => [department.id, department])
      );
      const combinedData = airportsData.map((attraction) => {
        const department = departmentsMap.get(attraction.city.departmentId);
        return {
          ...attraction,
          departmentName: department?.name || "Desconocido",
        };
      });
      setAirportsData(combinedData.sort((a, b) => a.id - b.id));
      const endTime = performance.now();
      setFetchTime((endTime - startTime) / 1000);
      console.log(airportsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDepartmentFilter = (e) => {
    setSelectedDepartment(e.target.value);
    filterAirports(e.target.value, selectedCity);
  };

  const handleCityFilter = (e) => {
    setSelectedCity(e.target.value);
    filterAirports(selectedDepartment, e.target.value);
  };

  const filterAirports = (departmentName, cityName) => {
    const filtered = airportsData.filter(
      (airport) =>
        (departmentName === "" || airport.departmentName === departmentName) &&
        (cityName === "" || airport.city.name === cityName)
    );
    setFilteredAirports(filtered);
  };
  const clearFilters = () => {
    console.log("clear filters");
    setSelectedDepartment("");
    setSelectedCity("");
    setFilteredAirports(airportsData);
  };

  return (
    <div className="container-tab">
      <p>Filtrar por departamento:</p>
      <select onChange={handleDepartmentFilter} className="select-filters" value={selectedDepartment}>
        <option value="" hidden>
          Seleccione una opción
        </option>
        {groupedDepartments.map((department) => (
          <option key={department.name} value={department.name}>
            {department.name} ({department.count} aeropuertos)
          </option>
        ))}
      </select>
      <p>Filtrar por ciudad:</p>
      <select onChange={handleCityFilter} className="select-filters" value={selectedCity}>
        <option value="" hidden>
          Seleccione una ciudad
        </option>
        {groupedCities.map((city) => (
          <option key={city.name} value={city.name}>
            {city.name} ({city.count} atracciones)
          </option>
        ))}
      </select>
      <p onClick={clearFilters} className="button-clear-filters">
        Eliminar Filtros
      </p>
      <p>{filteredAirports.length} aeropuertos encontrados</p>
      <p>Realizado en {fetchTime} segundos</p>

      <AirportsTable filteredAirports={filteredAirports} />
    </div>
  );
}

export default AirportsTab;
