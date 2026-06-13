import "bootstrap/dist/css/bootstrap.min.css";

export default function EstudianteTable({
  data,
  onEdit,
  onDelete,
  onMatricula,
  onApoderados,
}) {
  const getApoderadoDisplay = (estudiante) => {
    const lista = estudiante.apoderados || estudiante.apoderados_detail || [];
    if (lista.length === 0) return null;
    const principal = lista.find((rel) => rel.es_principal) || lista[0];
    const info = principal.apoderado;
    if (!info) return "Dato incompleto";
    return { nombre: `${info.nombres} ${info.apellidos}`, tipo: principal.tipo_relacion || "Relación" };
  };

  return (
    <div className="table-responsive">
      <table className="est-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>DNI</th>
            <th>Fecha Nacimiento</th>
            <th>Apoderado Principal</th>
            <th style={{ textAlign: "center" }}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((e) => {
              const apo = getApoderadoDisplay(e);
              return (
                <tr key={e.id}>
                  <td className="td-code">{e.codigo_estudiante || "—"}</td>
                  <td className="td-nombre">{e.nombres}</td>
                  <td>{e.apellidos}</td>
                  <td>{e.dni || "—"}</td>
                  <td>{e.fecha_nacimiento}</td>
                  <td>
                    {apo ? (
                      <>
                        {apo.nombre}
                        <span className="apo-badge">{apo.tipo}</span>
                      </>
                    ) : (
                      <span className="td-no-apo">Sin apoderado</span>
                    )}
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn-icon-act btn-act-view"
                        title="Ver matrícula"
                        onClick={() => onMatricula(e)}
                      >
                        👁
                      </button>
                      <button
                        className="btn-icon-act btn-act-edit"
                        title="Editar"
                        onClick={() => onEdit(e)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon-act btn-act-delete"
                        title="Eliminar"
                        onClick={() => onDelete(e.id)}
                      >
                        🗑
                      </button>
                      <button
                        className="btn-apo"
                        title="Apoderados"
                        onClick={() => onApoderados(e)}
                      >
                        Apo
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan="7"
                style={{
                  textAlign: "center",
                  padding: "48px 20px",
                  color: "var(--outline)",
                  fontStyle: "italic",
                  fontSize: 14,
                }}
              >
                No hay estudiantes registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}