import axiosInstance from './axiosConfig';

const CONCEPTOS_URL = '/pagos/conceptos';
const PAGOS_URL = '/pagos/pagos';
const DEUDAS_URL = '/pagos/deudas';
const CAJA_URL = '/pagos/cajas';

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
    const response = await axiosInstance.get(`${DEUDAS_URL}/`, { params });
    return response.data;
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
    const response = await axiosInstance.get(`${PAGOS_URL}/`, {
      params: { alumno: alumnoId, ordering: '-fecha_pago' }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDeudasHistoricas = async (alumnoId) => {
  try {
    const response = await axiosInstance.get(`${DEUDAS_URL}/`, {
      params: { alumno: alumnoId, incluir_pagadas: true, ordering: 'fecha_vencimiento' }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
