import "bootstrap/dist/css/bootstrap.min.css";
export default function EstudianteTable({
  data,
  onEdit,
  onDelete,
  onMatricula,
  onApoderados,
}) {
  // Función auxiliar para obtener el apoderado a mostrar
  const getApoderadoDisplay = (estudiante) => {
    const lista = estudiante.apoderados || estudiante.apoderados_detail || [];
    if (lista.length === 0) return "Sin apoderado";

    const principal = lista.find((rel) => rel.es_principal) || lista[0];
    const info = principal.apoderado;

    if (!info) return "Dato incompleto";

    return `${info.nombres} ${info.apellidos} (${principal.tipo_relacion || "Relación"})`;
  };

  return (
    <div className="card-custom">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Lista de Estudiantes</h5>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th className="text-center">Código</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>DNI</th>
              <th>Fecha Nacimiento</th>
              <th>Apoderado Principal</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((e) => (
                <tr key={e.id}>
                  <td>{e.codigo_estudiante}</td>
                  <td>{e.nombres}</td>
                  <td>{e.apellidos}</td>
                  <td>{e.dni}</td>
                  <td>{e.fecha_nacimiento}</td>
                  <td>{getApoderadoDisplay(e)}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => onMatricula(e)}
                    >
                      👁️
                    </button>

                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => onEdit(e)}
                    >
                      ✏️
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(e.id)}
                    >
                      🗑️
                    </button>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => onApoderados(e)}
                    >
                      Apo
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No hay estudiantes registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
