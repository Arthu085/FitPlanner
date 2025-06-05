import api from "../services/api";

export const login = async (data) => {
	try {
		const response = await api.post("/auth/login", data);
		return response.data;
	} catch (error) {
		throw error.response?.data || { message: "Erro de conexão" };
	}
};
