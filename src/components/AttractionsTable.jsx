/* eslint-disable react/prop-types */
function AttractionsTable({ filteredAttractions }) {
  return (
    <>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Departamento</th>
              <th>Ciudad</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttractions.map((attraction) => (
              <tr key={attraction.id}>
                <td>{attraction.id}</td>
                <td>
                  <img
                    src={`${attraction.images}`}
                    alt={attraction.name}
                    className="attraction-image"
                  />
                </td>
                <td>{attraction.name}</td>
                <td>{attraction.description}</td>
                <td>{attraction.departmentName}</td>
                <td>{attraction.city.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AttractionsTable;
