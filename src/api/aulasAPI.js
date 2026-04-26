import axiosInstance from './axiosConfig';

const AULAS_URL = '/aulas';

export const getAulas = async () => {
	try {
		const response = await axiosInstance.get(`${AULAS_URL}/`);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getAula = async (id) => {
	try {
		const response = await axiosInstance.get(`${AULAS_URL}/${id}/`);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const createAula = async (data) => {
	try {
		const response = await axiosInstance.post(`${AULAS_URL}/`, data);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const updateAula = async (id, data) => {
	try {
		const response = await axiosInstance.put(`${AULAS_URL}/${id}/`, data);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const deleteAula = async (id) => {
	try {
		await axiosInstance.delete(`${AULAS_URL}/${id}/`);	
	} catch (error) {
		throw error;
	}
};
