import api from "../services/api";

export const fetchAllExercises = async (token, page = 1, limit = 6) => {
	try {
		const response = await api.get(`/exercise?page=${page}&limit=${limit}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || { message: "Erro de conexão" };
	}
};

export const deleteExercise = async (token, id) => {
	try {
		const response = await api.delete(`/exercise/delete/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || { message: "Erro de conexão" };
	}
};
