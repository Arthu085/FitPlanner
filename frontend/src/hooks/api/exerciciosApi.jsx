export const fetchExercicios = async (page = 1, limit = 8) => {
	try {
		const response = await fetch(
			`http://localhost:3000/api/exercicios/getexercicios?page=${page}&limit=${limit}`
		);
		const data = await response.json();

		if (!data.success) {
			return { success: data.success, message: data.message };
		}

		if (data.data.length === 0) {
			return {
				success: true,
				data: [],
				message: data.message,
			};
		}

		return data;
	} catch (error) {
		return {
			success: false,
			message: "Erro ao conectar-se ao servidor: " + error.message,
		};
	}
};

export const createExercicio = async (exercicioData) => {
	try {
		const result = await fetch(
			"http://localhost:3000/api/exercicios/addexercicio",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(exercicioData),
			}
		);

		const data = await result.json();

		if (!data.success) {
			return { success: data.success, message: data.message };
		}

		return data;
	} catch (error) {
		return {
			success: false,
			message: "Erro ao conectar-se ao servidor: " + error.message,
		};
	}
};

export const deleteExercicio = async (id_exercise) => {
	try {
		const result = await fetch(
			`http://localhost:3000/api/exercicios/deleteexercicio/${id_exercise}`,
			{
				method: "DELETE",
			}
		);

		const data = await result.json();

		if (!data.success) {
			return { success: data.success, message: data.message };
		}

		return data;
	} catch (error) {
		return {
			success: false,
			message: "Erro ao conectar-se ao servidor: " + error.message,
		};
	}
};

export const editExercicio = async (exercicioData) => {
	try {
		const result = await fetch(
			`http://localhost:3000/api/exercicios/editexercicio/${exercicioData.id_exercise}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ exercise_name: exercicioData.exercise_name }),
			}
		);
		const data = await result.json();

		if (!data.success) {
			return { success: data.success, message: data.message };
		}

		return data;
	} catch (error) {
		return {
			success: false,
			message: "Erro ao conectar-se ao servidor: " + error.message,
		};
	}
};
