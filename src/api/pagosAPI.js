import axiosInstance from './axiosConfig';

const CONCEPTOS_URL = '/pagos/conceptos';
const PAGOS_URL = '/pagos/pagos';
const DEUDAS_URL = '/pagos/deudas';
const CAJA_URL = '/pagos/cajas';

const fetchAllPages = async (url, params = {}) => {
  let allResults = [];
  let page = 1;
  let hasNext = true;
  
  while (hasNext) {
    const response = await axiosInstance.get(url, {
      params: { ...params, page }
    });
    const data = response.data;
    
    if (data && data.results && Array.isArray(data.results)) {
      allResults = [...allResults, ...data.results];
      hasNext = !!data.next;
      page += 1;
    } else if (Array.isArray(data)) {
      allResults = [...allResults, ...data];
      hasNext = false;
    } else {
      return data;
    }
  }
  return allResults;
};
export const registrarPagoParent = async (
  formData
) => {

  const response =
    await axiosInstance.post(
      "/pagos/parent/registrar-pago/",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data"
        }
      }
    );

  return response.data;
};

export const getPagosPendientes = async () => {

  const response = await axiosInstance.get(
    "/pagos/pendientes/"
  );

  return response.data;
};

export const aprobarPago = async (id) => {

  const response = await axiosInstance.post(
    `/pagos/${id}/aprobar/`
  );

  return response.data;
};

export const rechazarPago = async (
  id,
  motivo
) => {

  const response = await axiosInstance.post(
    `/pagos/${id}/rechazar/`,
    {
      motivo
    }
  );

  return response.data;
};

// Conceptos de Pago
export const getConceptosPago = async () => {
  try {
    const response = await axiosInstance.get(`${CONCEPTOS_URL}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getConceptoPago = async (id) => {
  try {
    const response = await axiosInstance.get(`${CONCEPTOS_URL}/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createConceptoPago = async (data) => {
  try {
    const response = await axiosInstance.post(`${CONCEPTOS_URL}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateConceptoPago = async (id, data) => {
  try {
    const response = await axiosInstance.put(`${CONCEPTOS_URL}/${id}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteConceptoPago = async (id) => {
  try {
    const response = await axiosInstance.delete(`${CONCEPTOS_URL}/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Pagos
export const getPagos = async () => {
  try {
    const response = await axiosInstance.get(`${PAGOS_URL}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPago = async (id) => {
  try {
    const response = await axiosInstance.get(`${PAGOS_URL}/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPago = async (data) => {
  try {
    const response = await axiosInstance.post(`${PAGOS_URL}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePago = async (id, data) => {
  try {
    const response = await axiosInstance.put(`${PAGOS_URL}/${id}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const partialUpdatePago = async (id, data) => {
  try {
    const response = await axiosInstance.patch(`${PAGOS_URL}/${id}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePago = async (id) => {
  try {
    const response = await axiosInstance.delete(`${PAGOS_URL}/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const searchPagos = async (query) => {
  try {
    const response = await axiosInstance.get(`${PAGOS_URL}/`, {
      params: { search: query }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Deudas
export const getDeudasByAlumno = async (alumnoId, incluirPagadas = false) => {
  try {
    const params = {
      alumno: alumnoId,
      incluir_pagadas: incluirPagadas
    };
    return await fetchAllPages(`${DEUDAS_URL}/`, params);
  } catch (error) {
    throw error;
  }
};

export const getDeuda = async (id) => {
  try {
    const response = await axiosInstance.get(`${DEUDAS_URL}/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createDeuda = async (data) => {
  try {
    const response = await axiosInstance.post(`${DEUDAS_URL}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cajas
export const getMiEstadoCaja = async () => {
  try {
    const response = await axiosInstance.get(`${CAJA_URL}/mi_estado/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const abrirCaja = async (montoInicial = 0) => {
  try {
    const response = await axiosInstance.post(`${CAJA_URL}/abrir_caja/`, {
      monto_inicial: montoInicial
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cerrarCaja = async (cajaId) => {
  try {
    const response = await axiosInstance.post(`${CAJA_URL}/${cajaId}/cerrar_caja/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getResumenIngresos = async (cajaId) => {
  try {
    const response = await axiosInstance.get(`${CAJA_URL}/${cajaId}/resumen_ingresos/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Auditoría y Historial
export const getPagosByAlumno = async (alumnoId) => {
  try {
    return await fetchAllPages(`${PAGOS_URL}/`, { alumno: alumnoId, ordering: '-fecha_pago' });
  } catch (error) {
    throw error;
  }
};

export const getDeudasHistoricas = async (alumnoId) => {
  try {
    return await fetchAllPages(`${DEUDAS_URL}/`, { alumno: alumnoId, incluir_pagadas: true, ordering: 'id' });
  } catch (error) {
    throw error;
  }
};

// Bancos y Aprobaciones
export const getBancos = async (activosSolo = true) => {
  try {
    const params = activosSolo ? { activo: true } : {};
    const response = await axiosInstance.get('/pagos/bancos/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createBanco = async (data) => {
  try {
    const response = await axiosInstance.post('/pagos/bancos/', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBanco = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/pagos/bancos/${id}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBanco = async (id) => {
  try {
    const response = await axiosInstance.delete(`/pagos/bancos/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getPagosPendientesAprobacion = async () => {
  try {
    const response = await axiosInstance.get(`${PAGOS_URL}/pendientes_aprobacion/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPagosPendientesCount = async () => {
  try {
    const response = await axiosInstance.get(`${PAGOS_URL}/pendientes_count/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const procesarAprobacionPago = async (id, data) => {
  try {
    const response = await axiosInstance.post(`${PAGOS_URL}/${id}/procesar_aprobacion/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
