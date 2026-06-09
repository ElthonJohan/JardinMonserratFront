import axiosInstance from "./axiosConfig";

const APODERADOS_URL = "/apoderados";


export const getApoderadosEstudiante = async (id) => {
  const response = await axiosInstance.get(
    `/estudiantes/${id}/apoderados/`
  );

  return response.data;
};

export const agregarApoderado = async (
  estudianteId,
  data
) => {

  const response = await axiosInstance.post(
    `/estudiantes/${estudianteId}/agregar-apoderado/`,
    data
  );

  return response.data;
};

export const cambiarPrincipal = async (
  relacionId
) => {

  const response = await axiosInstance.patch(
    `/apoderado-relacion/${relacionId}/principal/`
  );

  return response.data;
};

export const eliminarRelacion = async (
  relacionId
) => {

  const response = await axiosInstance.delete(
    `/apoderado-relacion/${relacionId}/`
  );

  return response.data;
};

export const getApoderados = async () => {
  try {
    const response = await axiosInstance.get(`${APODERADOS_URL}/`);
    console.log("Apoderados obtenidos:", response.data);
    return response.data;
    } catch (error) {
    throw error;
    }
};

export const getApoderado = async (id) => {
  try {
    const response = await axiosInstance.get(`${APODERADOS_URL}/${id}/`);
    return response.data;
    } catch (error) {
    throw error;
    }
};

export const createApoderado = async (data) => {
  try {
    const response = await axiosInstance.post(`${APODERADOS_URL}/`, data);
    return response.data;
    }
    catch (error) {
    throw error;
    }
};

export const updateApoderado = async (id, data) => {
  try {
    const response = await axiosInstance.put(`${APODERADOS_URL}/${id}/`, data);
    return response.data;
    } catch (error) {
    throw error;
    }
};

export const deleteApoderado = async (id) => {
  try {
    const response = await axiosInstance.delete(`${APODERADOS_URL}/${id}/`);
    return response;
    } catch (error) {
    throw error;
    }
};