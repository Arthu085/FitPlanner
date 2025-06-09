import api from "../services/api";

export const fetchTrainingSession = async (token) => {
	try {
		const response = await api.get("/training/session/", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || { message: "Erro de conexão" };
	}
};

export const fetchTrainingSessionById = async (token, id) => {
	try {
		const response = await api.get(`/training/session/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || { message: "Erro de conexão" };
	}
};
