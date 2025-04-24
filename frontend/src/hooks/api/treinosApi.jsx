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

		if (!data.success) {
			return { success: false, message: data.message };
		}

		if (data.data.length === 0) {
			return {
				success: true,
				data: [],
				message: data.message,
			};
		}

		return { success: true, data: data.data };
	} catch (error) {
		return {
			success: false,
			message: "Erro ao conectar-se ao servidor: " + error.message,
		};
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

		if (!data.success) {
			return { success: false, message: data.message };
		}

		return data;
	} catch (error) {
		return {
			success: false,
			message: "Erro ao conectar-se ao servidor: " + error.message,
		};
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

		if (!data.success) {
			return { success: false, message: data.message };
		}

		return data;
	} catch (error) {
		return {
			success: false,
			message: "Erro ao conectar-se ao servidor: " + error.message,
		};
	}
};
