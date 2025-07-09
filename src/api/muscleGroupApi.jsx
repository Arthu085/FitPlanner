import api from "../services/api";

export const fetchAllMuscleGroups = async (token) => {
	try {
		const response = await api.get(`/muscle/group/`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || { message: "Erro de conexão" };
	}
};
