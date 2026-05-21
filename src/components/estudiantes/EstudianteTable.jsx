
import "bootstrap/dist/css/bootstrap.min.css";
export default function EstudianteTable({ data, onEdit, onDelete }) {
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
              <th>Aula</th>
              <th>Apoderado</th>
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
                  <td>
                    <span className="badge bg-info text-dark">
                      {e.aula_nombre}
                    </span>
                  </td>
                  <td>{e.apoderado_nombre}</td>

                  <td className="text-center">
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
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
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