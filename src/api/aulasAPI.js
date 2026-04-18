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
