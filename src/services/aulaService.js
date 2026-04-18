import axiosInstance from "../api/axiosConfig";

export const getAulas = () => axiosInstance.get("/aulas/");
export const createAula = (data) => axiosInstance.post("/aulas/", data);
export const updateAula = (id, data) => axiosInstance.put(`/aulas/${id}/`, data);
export const deleteAula = (id) => axiosInstance.delete(`/aulas/${id}/`);