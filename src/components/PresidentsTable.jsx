/* eslint-disable react/prop-types */
function PresidentsTable({ filteredPresidents }) {
  return (
    <>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Fecha de inicio del período</th>
              <th>Fecha de finalización del período</th>
              <th>Partido</th>
              <th>Descripción</th>
              <th>Ciudad</th>
            </tr>
          </thead>
          <tbody>
            {filteredPresidents.map((data) => (
              <tr key={data.id}>
                <td>{data.id}</td>
                <td>
                  <img
                    src={`${data.image}`}
                    alt={data.name}
                    className="president-image"
                  />
                </td>
                <td>{data.name}</td>
                <td>{data.lastName}</td>
                <td>{data.startPeriodDate}</td>
                <td>{data.endPeriodDate}</td>
                <td>{data.politicalParty}</td>
                <td>{data.description}</td>
                <td>{data.cityName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default PresidentsTable;
