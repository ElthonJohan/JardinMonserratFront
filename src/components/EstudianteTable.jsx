export default function EstudianteTable({ data, onEdit, onDelete }) {
  return (
    <div className="card p-3">
      <h5>Lista de Estudiantes</h5>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Aula</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(data) && data.map((e) => (
            <tr key={e.id}>
              <td>{e.nombres}</td>
              <td>{e.apellidos}</td>
              <td>{e.aula}</td>

              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => onEdit(e)}>
                  Editar
                </button>

                <button className="btn btn-danger btn-sm" onClick={() => onDelete(e.id)}>
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