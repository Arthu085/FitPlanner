export const fetchExercicios = async () => {
	try {
		const response = await fetch(
			"http://localhost:3000/api/exercicios/getexercicios"
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
