import axiosInstance from './axiosConfig';

export const getReporteLibretasAula = async (params) => {
  try {
    const response = await axiosInstance.get('/reportes/libretas-aula/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};
