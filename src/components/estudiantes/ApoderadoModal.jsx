import React from "react";

export default function ApoderadosModal({
  selectedStudent,
  studentParents,
  onMakePrincipal,
  onDeleteParent,
  onAddParent,
}) {
  return (
    <div className="modal fade" id="apoderadosModal" tabIndex="-1" aria-labelledby="apoderadosModalLabel">
      <div className="modal-dialog modal-xl">
        <div className="modal-content shadow-lg">
          <div className="modal-header bg-primary text-white border-0">
            <h5 className="modal-title" id="apoderadosModalLabel">
              Apoderados de{" "}
              <strong>
                {selectedStudent
                  ? `${selectedStudent.nombres} ${selectedStudent.apellidos}`
                  : "Estudiante"}
              </strong>
            </h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" />
          </div>

          <div className="modal-body">
            {studentParents.length === 0 ? (
              <div className="alert alert-info text-center py-4">
                <i className="bi bi-people fs-1 mb-3 d-block"></i>
                No existen apoderados registrados para este estudiante.
              </div>
            ) : (
              <div className="row g-3">
                {studentParents.map((parent) => (
                  <div key={parent.relacion_id} className="col-12 col-lg-6">
                    <div className="card h-100 shadow-sm border-0 hover-shadow">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="mb-1">
                              {parent.nombres} {parent.apellidos}
                            </h5>
                            {parent.es_principal && (
                              <span className="badge bg-success d-inline-flex align-items-center gap-1">
                                <i className="bi bi-star-fill"></i> Principal
                              </span>
                            )}
                          </div>
                        </div>

                        <hr className="my-3" />

                        <div className="small text-muted">
                          <p className="mb-1"><strong>DNI:</strong> {parent.dni}</p>
                          <p className="mb-1"><strong>Relación:</strong> {parent.tipo_relacion}</p>
                          <p className="mb-1"><strong>Email:</strong> {parent.email || "—"}</p>
                          <p className="mb-1"><strong>Teléfono:</strong> {parent.telefono || "—"}</p>
                          {parent.direccion && <p className="mb-1"><strong>Dirección:</strong> {parent.direccion}</p>}
                        </div>
                      </div>

                      <div className="card-footer bg-light border-0 d-flex gap-2">
                        {!parent.es_principal && (
                          <button
                            className="btn btn-outline-success btn-sm flex-grow-1"
                            onClick={() => onMakePrincipal(parent.relacion_id)}
                          >
                            <i className="bi bi-star"></i> Hacer Principal
                          </button>
                        )}
                        <button
                          className="btn btn-outline-danger btn-sm flex-grow-1"
                          onClick={() => onDeleteParent(parent.relacion_id)}
                        >
                          <i className="bi bi-trash"></i> Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-primary px-4"
              onClick={onAddParent}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Agregar Apoderado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}