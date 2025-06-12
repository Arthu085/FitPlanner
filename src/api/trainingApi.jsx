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
