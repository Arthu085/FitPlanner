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
			return { success: data.success, message: data.message };
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

export const editTreino = async (params) => {
	console.log(params);
	const {
		id_treino,
		id_treino_exercicio,
		id_exercise,
		serie,
		repeticoes,
		nome_treino,
	} = params;
	try {
		const url = id_treino_exercicio
			? `http://localhost:3000/api/treinos/edittreino/${id_treino}/${id_treino_exercicio}`
			: `http://localhost:3000/api/treinos/edittreino/${id_treino}`;

		const result = await fetch(url, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				nome_treino: nome_treino,
				serie: serie,
				repeticoes: repeticoes,
				id_exercise: id_exercise,
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

export const addExercicioOnEditing = async (exercicioData) => {
	try {
		const result = await fetch(
			"http://localhost:3000/api/treinos/edittreino/add",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id_treino: exercicioData.id_treino,
					id_exercise: exercicioData.id_exercise,
					serie: exercicioData.serie,
					repeticoes: exercicioData.repeticoes,
				}),
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

export const deleteExercicioOnEditing = async (id_treino_exercicio) => {
	try {
		const result = await fetch(
			`http://localhost:3000/api/treinos/edittreino/delete/${id_treino_exercicio}`,
			{
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
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
