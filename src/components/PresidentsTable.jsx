/* eslint-disable react/prop-types */
function PresidentsTable({ filteredPresidents }) {
  return (
    <>
      <div className="parent">
        <div className="div1">ID</div>
        <div className="div2">Imagen</div>
        <div className="div3">Nombre</div>
        <div className="div4">Apellidos</div>
        <div className="div5">Fecha de inicio</div>
        <div className="div6">Fecha de fin</div>
        <div className="div7">Partido</div>
        <div className="div8">Descripción</div>
        <div className="div9">Código Ciudad</div>
        <div className="div10">Ciudad</div>
      </div>
      <div>
        {filteredPresidents.map((data) => (
          <div key={data.id} className="president-card">
            <p>{data.id}</p>
            <img src={`${data.image}`} className="president-image"></img>
            <p>{data.name}</p>
            <p>{data.lastName}</p>
            <p>{data.startPeriodDate}</p>
            <p>{data.endPeriodDate}</p>
            <p>{data.politicalParty}</p>
            <p>{data.description}</p>
            <p>{data.cityId}</p>
            <p>{data.city}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default PresidentsTable;
