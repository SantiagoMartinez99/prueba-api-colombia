/* eslint-disable react/prop-types */

function AirportsTable({ filteredAirports }) {
  return (
    <>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Ciudad</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {filteredAirports.map((airport) => (
              <tr key={airport.id}>
                <td>{airport.id}</td>
                <td>{airport.name}</td>
                <td>{airport.city.name}</td>
                <td>{airport.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AirportsTable;
