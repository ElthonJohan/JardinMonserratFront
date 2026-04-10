import axiosInstance from './axiosConfig';

const API_URL = '/core/alumnos';

export const getAlumnos = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAlumno = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAlumno = async (data) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAlumno = async (id, data) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const partialUpdateAlumno = async (id, data) => {
  try {
    const response = await axiosInstance.patch(`${API_URL}/${id}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAlumno = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAlumnosActivos = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/activos/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchAlumnos = async (query) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/`, {
      params: { search: query }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
