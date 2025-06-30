import api from "../services/api";

export const fetchAllExercises = async (token) => {
	try {
		const response = await api.get(`/exercise`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || { message: "Erro de conexão" };
	}
};
