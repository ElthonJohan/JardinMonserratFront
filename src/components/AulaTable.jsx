export default function AulaTable({ data, onEdit, onDelete }) {
  return (
    <div className="card p-3">
      <h5>Lista de Aulas</h5>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Capacidad</th>
            <th>Edad</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(data) && data.map((a) => (
            <tr key={a.id}>
              <td>{a.nombre}</td>
              <td>{a.capacidad}</td>
              <td>{a.edad_min} - {a.edad_max}</td>

              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => onEdit(a)}
                >
                  Editar
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(a.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
    </table>
    </div>
  );
}