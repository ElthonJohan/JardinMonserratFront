import axiosInstance from "../api/axiosConfig";

export const getEstudiantes = () => axiosInstance.get("/estudiantes/");
export const createEstudiante = (data) => axiosInstance.post("/estudiantes/", data);
export const updateEstudiante = (id, data) => axiosInstance.put(`/estudiantes/${id}/`, data);
export const deleteEstudiante = (id) => axiosInstance.delete(`/estudiantes/${id}/`);
export const getAulas = () => axiosInstance.get("/aulas/");
export const getApoderados = () => axiosInstance.get("/apoderados/");