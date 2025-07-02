import api from "../services/api";

export const fetchTraining = async (token) => {
	try {
		const response = await api.get(`/training/`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || { message: "Erro de conexão" };
	}
};

export const fetchTrainingDetails = async (token, id) => {
	try {
		const response = await api.get(`/training/details/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || { message: "Erro de conexão" };
	}
};

export const deleteTraining = async (token, id) => {
	try {
		const response = await api.delete(`/training/delete/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || { message: "Erro de conexão" };
	}
};

export const createTraining = async (token, data) => {
	try {
		const response = await api.post(`/training/create`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || { message: "Erro de conexão" };
	}
};

export const editTraining = async (token, id, data) => {
	try {
		const response = await api.post(`/training/edit/${id}`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || { message: "Erro de conexão" };
	}
};
