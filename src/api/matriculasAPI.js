import axiosInstance from './axiosConfig';

const API_URL = '/matriculas/matriculas';

export const getMatriculas = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMatricula = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createMatricula = async (data) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMatricula = async (id, data) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const partialUpdateMatricula = async (id, data) => {
  try {
    const response = await axiosInstance.patch(`${API_URL}/${id}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMatricula = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const searchMatriculas = async (query) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/`, {
      params: { search: query }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
