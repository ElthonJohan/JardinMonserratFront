import axiosInstance from './axiosConfig';

const NOTIFICACIONES_URL = '/notificaciones/notificaciones';

export const getNotificaciones = async () => {
  try {
    const response = await axiosInstance.get(`${NOTIFICACIONES_URL}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const marcarNotificacionLeida = async (id) => {
  try {
    const response = await axiosInstance.patch(`${NOTIFICACIONES_URL}/${id}/marcar_leido/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
