import apiClient from './axiosConfig';

/**
 * Obtiene las estadísticas agregadas y desgloses para el dashboard
 * @param {number} anio - Filtro por año lectivo (ej. 2026)
 * @returns {Promise<Object>} Promesa con los datos de las estadísticas
 */
export const getDashboardStats = async (anio) => {
  try {
    const response = await apiClient.get('/reportes/dashboard/stats/', {
      params: { anio }
    });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo estadísticas del dashboard:', error);
    throw error;
  }
};
