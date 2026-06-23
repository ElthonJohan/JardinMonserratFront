import { useEffect, useState } from "react";
import { AppNavbar } from "../components/shared";
import {
  getConfiguracionPagos,
  createConfiguracionPagos,
  updateConfiguracionPagos
} from "../api/PagosAPI";

import toast from "react-hot-toast";

export default function ConfiguracionPagosPage() {

  const [loading, setLoading] = useState(true);

  const [configId, setConfigId] = useState(null);

  const [formData, setFormData] = useState({
    titular_yape: "",
    numero_yape: "",
    qr_yape: null,

    titular_plin: "",
    numero_plin: "",
    qr_plin: null,
  });

  const [previewYape, setPreviewYape] = useState(null);
  const [previewPlin, setPreviewPlin] = useState(null);

  useEffect(() => {
    loadConfiguracion();
  }, []);

  const loadConfiguracion = async () => {

    try {

      const data = await getConfiguracionPagos();
      console.log(data);

      if (data) {

        setConfigId(data.id);

        setFormData({
          titular_yape: data.titular_yape || "",
          numero_yape: data.numero_yape || "",
          qr_yape: null,

          titular_plin: data.titular_plin || "",
          numero_plin: data.numero_plin || "",
          qr_plin: null,
        });

        setPreviewYape(data.qr_yape);
        setPreviewPlin(data.qr_plin);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFile = (e) => {

    const { name, files } = e.target;

    if (!files.length) return;

    const file = files[0];

    setFormData(prev => ({
      ...prev,
      [name]: file
    }));

    const preview = URL.createObjectURL(file);

    if (name === "qr_yape") {
      setPreviewYape(preview);
    }

    if (name === "qr_plin") {
      setPreviewPlin(preview);
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {

        if (value !== null) {
          payload.append(key, value);
        }

      });

      if (configId) {

        await updateConfiguracionPagos(
          configId,
          payload
        );

        toast.success(
          "Configuración actualizada"
        );

      } else {

        await createConfiguracionPagos(
          payload
        );

        toast.success(
          "Configuración creada"
        );

      }

      loadConfiguracion();

    } catch (error) {

      console.error(error);

      toast.error(
        "No se pudo guardar"
      );
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }


  console.log("QR YAPE:", previewYape);
console.log("QR PLIN:", previewPlin);

  return (
    <>
      <AppNavbar />

      <div className="container-fluid container-custom">

        <div className="page-header mb-4">
          <h1 className="page-title">
            Configuración de Pagos
          </h1>
          <p className="text-muted">
            Configure los datos de Yape y Plin
            que verán los apoderados.
          </p>
        </div>

        <div className="card shadow-sm border-0">

          <div className="card-body p-4">

            <form onSubmit={handleSubmit}>

              {/* YAPE */}

              <h5 className="mb-3">
                📱 Configuración Yape
              </h5>

              <div className="row">

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Titular
                  </label>

                  <input
                    type="text"
                    name="titular_yape"
                    className="form-control"
                    value={formData.titular_yape}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Número Yape
                  </label>

                  <input
                    type="text"
                    name="numero_yape"
                    className="form-control"
                    value={formData.numero_yape}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-12 mb-4">
                  <label className="form-label">
                    QR Yape
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    name="qr_yape"
                    onChange={handleFile}
                  />
                </div>

              </div>

              {/* PLIN */}

              <h5 className="mb-3">
                💳 Configuración Plin
              </h5>

              <div className="row">

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Titular
                  </label>

                  <input
                    type="text"
                    name="titular_plin"
                    className="form-control"
                    value={formData.titular_plin}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Número Plin
                  </label>

                  <input
                    type="text"
                    name="numero_plin"
                    className="form-control"
                    value={formData.numero_plin}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-12 mb-4">
                  <label className="form-label">
                    QR Plin
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    name="qr_plin"
                    onChange={handleFile}
                  />
                </div>

              </div>

              {/* PREVIEW */}

              <div className="row mt-4">

                <div className="col-md-6">

                  <div className="card text-center">

                    <div className="card-header">
                      Vista previa Yape
                    </div>

                    <div className="card-body">

                      {previewYape && (
                        <img
                          src={previewYape}
                          alt="QR Yape"
                          style={{
                            width: 180,
                            height: 180,
                            objectFit: "contain"
                          }}
                        />
                      )}

                      <h5 className="mt-3">
                        {formData.numero_yape}
                      </h5>

                      <p>
                        {formData.titular_yape}
                      </p>

                    </div>

                  </div>

                </div>

                <div className="col-md-6">

                  <div className="card text-center">

                    <div className="card-header">
                      Vista previa Plin
                    </div>

                    <div className="card-body">

                      {previewPlin && (
                        <img
                          src={previewPlin}
                          alt="QR Plin"
                          style={{
                            width: 180,
                            height: 180,
                            objectFit: "contain"
                          }}
                        />
                      )}

                      <h5 className="mt-3">
                        {formData.numero_plin}
                      </h5>

                      <p>
                        {formData.titular_plin}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              <div className="text-end mt-4">

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  💾 Guardar Configuración
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>
    </>
  );
}