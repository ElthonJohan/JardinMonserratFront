import axiosInstance from "./axiosConfig";

const APODERADOS_URL = "/apoderados";

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