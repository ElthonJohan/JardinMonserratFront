import axiosInstance from './axiosConfig';

const CONCEPTOS_URL = '/pagos/conceptos';
const PAGOS_URL = '/pagos/pagos';

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
