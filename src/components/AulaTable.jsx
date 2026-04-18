export default function AulaTable({ data, onEdit, onDelete }) {
  return (
    <div className="card-custom">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Lista de Aulas</h5>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>Nombre</th>
              <th>Capacidad</th>
              <th>Edad</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((a) => (
                <tr key={a.id}>
                  <td>{a.nombre}</td>
                  <td>{a.capacidad}</td>
                  <td>
                    {a.edad_min} - {a.edad_max}
                  </td>

                  <td className="text-center">
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => onEdit(a)}
                    >
                      ✏️
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(a.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No hay aulas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
