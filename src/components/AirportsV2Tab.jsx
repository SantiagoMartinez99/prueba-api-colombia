import { useState, useEffect } from "react";
import AirportsV2Table from "./AirportsV2Table";

function AirportsV2Tab() {
  const [airportsData, setAirportsData] = useState([]);
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [groupedDepartments, setGroupedDepartments] = useState([]);
  const [groupedCities, setGroupedCities] = useState([]);
  const [groupedRegions, setGroupedRegions] = useState([]);
  const [groupedTypes, setGroupedTypes] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [fetchTime, setFetchTime] = useState(0);

  useEffect(() => {
    fetchAirportsData();
  }, []);

  useEffect(() => {
    const departments = getUniqueDepartments(airportsData);
    const cities = getUniqueCities(airportsData);
    const regions = getUniqueRegions(airportsData);
    const types = getUniqueTypes(airportsData);

    setGroupedDepartments(departments);
    setGroupedCities(cities);
    setGroupedRegions(regions);
    setGroupedTypes(types);
    setFilteredAirports(airportsData);
  }, [airportsData]);

  const fetchAirportsData = async () => {
    try {
      const startTime = performance.now();
      const [responseRegions, responseAirports, responseDepartments] =
        await Promise.all([
          fetch("https://api-colombia.com/api/v1/Region"),
          fetch("https://api-colombia.com/api/v1/Airport"),
          fetch("https://api-colombia.com/api/v1/Department"),
        ]);
      const regionsData = await responseRegions.json();
      const airportsData = await responseAirports.json();
      const departmentsData = await responseDepartments.json();
      const departmentsMap = new Map(
        departmentsData.map((department) => [department.id, department])
      );
      console.log(regionsData);
      console.log(airportsData);
      console.log(departmentsData);

      const combinedData = airportsData.map((airport) => {
        const department = departmentsMap.get(airport.city.departmentId);
        return {
          ...airport,
          departmentName: department?.name || "Desconocido",
          regionName: airport.region.name,
          type: airport.type,
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

  const getUniqueRegions = (airports) => {
    const regions = [...new Set(airports.map((airport) => airport.regionName))];
    return regions
      .map((regionName) => ({
        name: regionName,
        count: airports.filter((airport) => airport.regionName === regionName)
          .length,
      }))
      .sort((a, b) => b.count - a.count);
  };

  const getUniqueTypes = (airports) => {
    const types = [...new Set(airports.map((airport) => airport.type))];
    return types
      .map((typeName) => ({
        name: typeName,
        count: airports.filter((airport) => airport.type === typeName).length,
      }))
      .sort((a, b) => b.count - a.count);
  };

  const handleDepartmentFilter = (e) => {
    setSelectedDepartment(e.target.value);
    filterAirports(e.target.value, selectedCity, selectedRegion, selectedType);
  };

  const handleCityFilter = (e) => {
    setSelectedCity(e.target.value);
    filterAirports(
      selectedDepartment,
      e.target.value,
      selectedRegion,
      selectedType
    );
  };

  const handleRegionFilter = (e) => {
    setSelectedRegion(e.target.value);
    filterAirports(
      selectedDepartment,
      selectedCity,
      e.target.value,
      selectedType
    );
  };

  const handleTypeFilter = (e) => {
    setSelectedType(e.target.value);
    filterAirports(
      selectedDepartment,
      selectedCity,
      selectedRegion,
      e.target.value
    );
  };

  const filterAirports = (departmentName, cityName, regionName, type) => {
    const filtered = airportsData.filter(
      (airport) =>
        (departmentName === "" || airport.departmentName === departmentName) &&
        (cityName === "" || airport.city.name === cityName) &&
        (regionName === "" || airport.regionName === regionName) &&
        (type === "" || airport.type === type)
    );
    setFilteredAirports(filtered);
  };

  const clearFilters = () => {
    setSelectedDepartment("");
    setSelectedCity("");
    setSelectedRegion("");
    setSelectedType("");
    setFilteredAirports(airportsData);
  };

  return (
    <div className="container-tab">
      <p>Filtrar por departamento:</p>
      <select
        onChange={handleDepartmentFilter}
        className="select-filters"
        value={selectedDepartment}
      >
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
      <select
        onChange={handleCityFilter}
        className="select-filters"
        value={selectedCity}
      >
        <option value="" hidden>
          Seleccione una ciudad
        </option>
        {groupedCities.map((city) => (
          <option key={city.name} value={city.name}>
            {city.name} ({city.count} atracciones)
          </option>
        ))}
      </select>
      <p>Filtrar por región:</p>
      <select
        onChange={handleRegionFilter}
        className="select-filters"
        value={selectedRegion}
      >
        <option value="" hidden>
          Seleccione una región
        </option>
        {groupedRegions.map((region) => (
          <option key={region.name} value={region.name}>
            {region.name} ({region.count} aeropuertos)
          </option>
        ))}
      </select>
      <p>Filtrar por tipo:</p>
      <select
        onChange={handleTypeFilter}
        className="select-filters"
        value={selectedType}
      >
        <option value="" hidden>
          Seleccione un tipo
        </option>
        {groupedTypes.map((type) => (
          <option key={type.name} value={type.name}>
            {type.name} ({type.count} aeropuertos)
          </option>
        ))}
      </select>
      <p onClick={clearFilters} className="button-clear-filters">
        Eliminar Filtros
      </p>
      <p>{filteredAirports.length} aeropuertos encontrados</p>
      <p>Realizado en {fetchTime} segundos</p>

      <AirportsV2Table filteredAirports={filteredAirports} />
    </div>
  );
}

export default AirportsV2Tab;
