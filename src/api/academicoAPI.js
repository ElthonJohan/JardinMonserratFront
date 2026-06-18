import axiosInstance from './axiosConfig';

// Periodos de Evaluación
export const getPeriodos = async (params) => {
  try {
    const response = await axiosInstance.get('/academico/periodos/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPeriodo = async (id) => {
  try {
    const response = await axiosInstance.get(`/academico/periodos/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPeriodo = async (data) => {
  try {
    const response = await axiosInstance.post('/academico/periodos/', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePeriodo = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/academico/periodos/${id}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePeriodo = async (id) => {
  try {
    const response = await axiosInstance.delete(`/academico/periodos/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Áreas Académicas
export const getAreas = async (params) => {
  try {
    const response = await axiosInstance.get('/academico/areas/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getArea = async (id) => {
  try {
    const response = await axiosInstance.get(`/academico/areas/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createArea = async (data) => {
  try {
    const response = await axiosInstance.post('/academico/areas/', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateArea = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/academico/areas/${id}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteArea = async (id) => {
  try {
    const response = await axiosInstance.delete(`/academico/areas/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Competencias
export const getCompetencias = async (params) => {
  try {
    const response = await axiosInstance.get('/academico/competencias/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCompetencia = async (id) => {
  try {
    const response = await axiosInstance.get(`/academico/competencias/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCompetencia = async (data) => {
  try {
    const response = await axiosInstance.post('/academico/competencias/', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCompetencia = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/academico/competencias/${id}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCompetencia = async (id) => {
  try {
    const response = await axiosInstance.delete(`/academico/competencias/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Asignaciones Docentes
export const getAsignaciones = async (params) => {
  try {
    const response = await axiosInstance.get('/academico/asignaciones/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAsignacion = async (id) => {
  try {
    const response = await axiosInstance.get(`/academico/asignaciones/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAsignacion = async (data) => {
  try {
    const response = await axiosInstance.post('/academico/asignaciones/', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAsignacion = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/academico/asignaciones/${id}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAsignacion = async (id) => {
  try {
    const response = await axiosInstance.delete(`/academico/asignaciones/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMisCursos = async () => {
  try {
    const response = await axiosInstance.get('/academico/asignaciones/mis-cursos/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Calificaciones
export const getCalificaciones = async (params) => {
  try {
    const response = await axiosInstance.get('/academico/calificaciones/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const bulkGuardarCalificaciones = async (data) => {
  try {
    const response = await axiosInstance.post('/academico/calificaciones/bulk_guardar/', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Apreciaciones
export const getApreciaciones = async (params) => {
  try {
    const response = await axiosInstance.get('/academico/apreciaciones/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createApreciacion = async (data) => {
  try {
    const response = await axiosInstance.post('/academico/apreciaciones/', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateApreciacion = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/academico/apreciaciones/${id}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
