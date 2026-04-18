import axiosInstance from "../api/axiosConfig";

export const getApoderados = () => axiosInstance.get("/apoderados/");
export const createApoderado = (data) => axiosInstance.post("/apoderados/", data);
export const updateApoderado = (id, data) => axiosInstance.put(`/apoderados/${id}/`, data);
export const deleteApoderado = (id) => axiosInstance.delete(`/apoderados/${id}/`);