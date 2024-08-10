import { useState, useEffect } from "react";

function AttractionsTab() {
  const [attractionsData, setAttractionsData] = useState([]);
  const [filteredAttractions, setFilteredAttractions] = useState([]);

  useEffect(() => {
    fetchAttractionsData();
  }, []);

  const fetchAttractionsData = async () => {
    try {
      const response = await fetch(
        "https://api-colombia.com/api/v1/TouristicAttraction"
      );
      const attractionsData = await response.json();
      setAttractionsData(attractionsData.sort((a, b) => a.id - b.id));
      console.log(attractionsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      {attractionsData.map((attraction) => (
        <div key={attraction.id} className="attraction-card">
          <p>{attraction.id}</p>
          <p>{attraction.name}</p>
          <p>{attraction.description}</p>
          <img src={`${attraction.images}`} className="attraction-image"></img>
        </div>
      ))}
    </div>
  );
}

export default AttractionsTab;
