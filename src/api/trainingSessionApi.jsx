import api from "../services/api";

export const fetchTrainingSession = async (token, page = 1, limit = 6) => {
	try {
		const response = await api.get(
			`/training/session/?page=${page}&limit=${limit}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		throw error.response?.data || { message: "Erro de conexão" };
	}
};

export const fetchTrainingSessionById = async (token, id) => {
	try {
		const response = await api.get(`/training/session/details/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || { message: "Erro de conexão" };
	}
};

export const deleteTrainingSession = async (token, id) => {
	try {
		const response = await api.delete(`/training/session/delete/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || { message: "Erro de conexão" };
	}
};

export const finishTrainingSession = async (token, id, exercises) => {
	try {
		const response = await api.post(
			`/training/session/finish/${id}`,
			{ exercises },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		throw error.response?.data || { message: "Erro de conexão" };
	}
};

export const startTrainingSession = async (token, id) => {
	try {
		const response = await api.post(
			`/training/session/start/${id}`,
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		throw error.response?.data || { message: "Erro de conexão" };
	}
};

export const fetchExerciseByTrainingAndSession = async (token, id) => {
	try {
		const response = await api.get(`/training/session/exercise/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || { message: "Erro de conexão" };
	}
};
