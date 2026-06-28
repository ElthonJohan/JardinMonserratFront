export default function ApoderadoTable({ data, onEdit, onDelete, onResetPassword }) {
  return (
    <div className="card p-3">
      <h5>Lista de Apoderados</h5>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>DNI</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(data) && data.map((a) => (
            <tr key={a.id}>
              <td>{a.nombres}</td>
              <td>{a.apellidos}</td>
              <td>{a.dni}</td>
              <td>{a.telefono}</td>
              <td>{a.email}</td>
              <td>{a.direccion}</td>

              <td>

                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => onEdit(a)}
                  title="Editar"
                >
                  ✏️
                </button>

                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => onResetPassword(a)}
                  title="Restablecer contraseña"
                >
                  🔑
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(a.id)}
                  title="Eliminar"
                >
                  🗑️
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}