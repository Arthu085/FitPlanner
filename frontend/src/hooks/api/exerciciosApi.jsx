export const fetchExercicios = async (page = 1, limit = 8) => {
	try {
		const response = await fetch(
			`http://localhost:3000/api/exercicios/getexercicios?page=${page}&limit=${limit}`
		);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Erro ao buscar exercício", error);
		throw error;
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

		if (!result.ok) {
			throw new Error(data.error || "Erro desconhecido");
		}

		return data;
	} catch (error) {
		console.error("Erro ao adicionar exercício:", error);
		throw error;
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
		return data;
	} catch (error) {
		console.error("Erro ao deletar exercício:", error);
		throw error;
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
		return data;
	} catch (error) {
		console.error("Erro ao editar exercício", error);
		throw error;
	}
};
