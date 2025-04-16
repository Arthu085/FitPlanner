export const fetchTreinos = async (userId) => {
	try {
		const result = await fetch(
			`http://localhost:3000/api/treinos/gettreinos/${userId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		const data = await result.json();
		return data;
	} catch (error) {
		console.error("Erro ao buscar treinos", error);
		throw error;
	}
};

export const createTreino = async (treinoData) => {
	try {
		const result = await fetch("http://localhost:3000/api/treinos/addtreino", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				nome_treino: treinoData.nome_treino,
				exercicios: treinoData.exercicios,
				id_user: treinoData.id_user,
			}),
		});

		const data = await result.json();
		return data;
	} catch (error) {
		console.error("Erro ao criar treino", error);
		throw error;
	}
};

export const deleteTreino = async (idTreino) => {
	try {
		const result = await fetch(
			`http://localhost:3000/api/treinos/deletetreino/${idTreino}`,
			{
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
			}
		);

		const data = await result.json();
		return data;
	} catch (error) {
		console.error("Erro ao excluir treino", error);
		throw error;
	}
};
