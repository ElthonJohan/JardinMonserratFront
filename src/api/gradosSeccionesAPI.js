import axiosInstance from './axiosConfig';

const GRADOS_URL = '/core/grados';
const SECCIONES_URL = '/core/secciones';

// Grados
export const getGrados = async () => {
  try {
    const response = await axiosInstance.get(`${GRADOS_URL}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGrado = async (id) => {
  try {
    const response = await axiosInstance.get(`${GRADOS_URL}/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createGrado = async (data) => {
  try {
    const response = await axiosInstance.post(`${GRADOS_URL}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateGrado = async (id, data) => {
  try {
    const response = await axiosInstance.put(`${GRADOS_URL}/${id}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteGrado = async (id) => {
  try {
    const response = await axiosInstance.delete(`${GRADOS_URL}/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Secciones
export const getSecciones = async () => {
  try {
    const response = await axiosInstance.get(`${SECCIONES_URL}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSeccion = async (id) => {
  try {
    const response = await axiosInstance.get(`${SECCIONES_URL}/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSeccion = async (data) => {
  try {
    const response = await axiosInstance.post(`${SECCIONES_URL}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSeccion = async (id, data) => {
  try {
    const response = await axiosInstance.put(`${SECCIONES_URL}/${id}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSeccion = async (id) => {
  try {
    const response = await axiosInstance.delete(`${SECCIONES_URL}/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};
