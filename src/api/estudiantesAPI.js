import axiosInstance from './axiosConfig';

const ESTUDIANTES_URL = '/estudiantes';

export const getEstudiantes = async () => {
  try {
    const response = await axiosInstance.get(`${ESTUDIANTES_URL}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getEstudiante = async (id) => {
  try {
    const response = await axiosInstance.get(`${ESTUDIANTES_URL}/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
