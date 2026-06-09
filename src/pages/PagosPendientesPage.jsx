import {
  useEffect,
  useState
} from "react";

import {
  Modal
} from "bootstrap";

import toast from "react-hot-toast";

import {
  getPagosPendientes,
  aprobarPago,
  rechazarPago
} from "../api/pagosAPI";

import PagosPendientesTable
from "../components/pagos/PagosPendientesTable";
import { AppNavbar } from "../components/shared";

export default function PagosPendientesPage() {
    
const [pagos, setPagos] =
  useState([]);

const [selectedPago,
  setSelectedPago] =
  useState(null);

const [motivo,
  setMotivo] =
  useState("");


  const loadPagos =
  async () => {

    try {

      const data =
        await getPagosPendientes();

      setPagos(data);

    }
    catch {

      toast.error(
        "Error al cargar pagos"
      );
    }
};

useEffect(() => {

  loadPagos();

}, []);


const handleApprove =
async (id) => {

  try {

    await aprobarPago(id);

    toast.success(
      "Pago aprobado"
    );

    loadPagos();

  }
  catch {

    toast.error(
      "No se pudo aprobar"
    );

  }
};

const handleViewVoucher =
(pago) => {

  setSelectedPago(
    pago
  );

  const modal =
    new Modal(
      document.getElementById(
        "voucherModal"
      )
    );

  modal.show();
};

const openRejectModal =
(pago) => {

  setSelectedPago(
    pago
  );

  const modal =
    new Modal(
      document.getElementById(
        "rejectModal"
      )
    );

  modal.show();
};


const confirmReject =
async () => {

  try {

    await rechazarPago(
      selectedPago.id,
      motivo
    );

    toast.success(
      "Pago rechazado"
    );

    loadPagos();

    setMotivo("");

  }
  catch {

    toast.error(
      "Error al rechazar"
    );

  }
};


return (
<>
<AppNavbar />

<div className="container">

  <h2 className="mb-4">

    Pagos Pendientes

  </h2>

  <PagosPendientesTable

    pagos={pagos}

    onApprove={
      handleApprove
    }

    onReject={
      openRejectModal
    }

    onViewVoucher={
      handleViewVoucher
    }

  />

</div>


<div
  className="modal fade"
  id="voucherModal"
>

  <div className="modal-dialog modal-lg">

    <div className="modal-content">

      <div className="modal-header">

        <h5>
          Voucher
        </h5>

      </div>

      <div className="modal-body">

        {
          selectedPago && (

            <img
              src={
                selectedPago.comprobante_img
              }
              alt="voucher"
              className="img-fluid"
            />

          )
        }

      </div>

    </div>

  </div>

</div>

<div
 className="modal fade"
 id="rejectModal"
>

 <div className="modal-dialog">

  <div className="modal-content">

   <div className="modal-header">

    <h5>
      Motivo de rechazo
    </h5>

   </div>

   <div className="modal-body">

    <textarea

      className="form-control"

      rows="4"

      value={motivo}

      onChange={(e)=>
        setMotivo(
          e.target.value
        )
      }

    />

   </div>

   <div className="modal-footer">

    <button
      className="
        btn
        btn-danger
      "
      onClick={
        confirmReject
      }
    >
      Rechazar
    </button>

   </div>

  </div>

 </div>

</div>

</>

);
}