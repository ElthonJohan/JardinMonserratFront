import axiosInstance from './axiosConfig';

const ESTUDIANTES_URL = '/estudiantes';

const AULAS_URL = '/aulas/';
const APODERADOS_URL = '/apoderados/';

export const getRegistroAlumnos = async () => {
  try {
    const response = await axiosInstance.get('/registro-alumno/'
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getEstudiantes = async () => {
  try {
    const response = await axiosInstance.get(`${ESTUDIANTES_URL}/`);
    console.log("RESPONSE COMPLETO 👉", response);
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


export const createEstudiante = async (data) => {
  try {
    const response = await axiosInstance.post(`${ESTUDIANTES_URL}/`, data); 
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateEstudiante = async (id, data) => {
  try {
    const response = await axiosInstance.put(`${ESTUDIANTES_URL}/${id}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteEstudiante = async (id) => {
  try {
    await axiosInstance.delete(`${ESTUDIANTES_URL}/${id}/`);
  } catch (error) {
    throw error;
  } 
};

export const getAulas = async () => {
  try {
    const response = await axiosInstance.get(AULAS_URL);
    return response.data;
  } catch (error) {
    throw error;
  } 
};

export const getApoderados = async () => {
  try {
    const response = await axiosInstance.get(APODERADOS_URL);
    return response.data;
  } catch (error) {
    throw error;
  } 
};

export const getEstudiantesByApoderado = async (apoderadoId) => {
  try {
    const response = await axiosInstance.get(`/estudiantes-por-apoderado/${apoderadoId}/`);
    return response.data;
  } catch (error) {
    throw error;
  } 
};

export const createRegistroAlumno = async (data) => {
  try {
    const response = await axiosInstance.post('/registro-alumno/', data);
    return response.data;
  } catch (error) {
    throw error;
  } 
};

export const buscarApoderadoPorDni = async (dni) => {

  const response = await axiosInstance.get(
    `/apoderados/buscar/?dni=${dni}`
  );

  return response.data;
};