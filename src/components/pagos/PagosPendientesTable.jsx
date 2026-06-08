export default function PagosPendienteTable({
  pagos,
  onApprove,
  onReject,
  onViewVoucher
}) {

  return (

    <div className="table-responsive">

      <table className="table table-hover">

        <thead>

          <tr>

            <th>Alumno</th>

            <th>Apoderado</th>

            <th>Concepto</th>

            <th>Monto</th>

            <th>Método</th>

            <th>Fecha</th>

            <th>Acciones</th>

          </tr>

        </thead>

        <tbody>

          {
            pagos.map(
              pago => (

                <tr key={pago.id}>

                  <td>
                    {pago.alumno_nombre}
                  </td>

                  <td>
                    {pago.apoderado_nombre}
                  </td>

                  <td>
                    {pago.concepto_nombre}
                  </td>

                  <td>
                    S/
                    {
                      Number(
                        pago.monto_total_entregado
                      ).toFixed(2)
                    }
                  </td>

                  <td>
                    {pago.metodo_pago}
                  </td>

                  <td>
                    {
                      new Date(
                        pago.fecha_pago
                      ).toLocaleDateString()
                    }
                  </td>

                  <td>

                    <button
                      className="
                        btn
                        btn-info
                        btn-sm
                        me-2
                      "
                      onClick={() =>
                        onViewVoucher(
                          pago
                        )
                      }
                    >
                      👁
                    </button>

                    <button
                      className="
                        btn
                        btn-success
                        btn-sm
                        me-2
                      "
                      onClick={() =>
                        onApprove(
                          pago.id
                        )
                      }
                    >
                      ✓
                    </button>

                    <button
                      className="
                        btn
                        btn-danger
                        btn-sm
                      "
                      onClick={() =>
                        onReject(
                          pago
                        )
                      }
                    >
                      ✕
                    </button>

                  </td>

                </tr>

              )
            )
          }

        </tbody>

      </table>

    </div>

  );
}