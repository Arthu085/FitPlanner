export const fetchMeta = async (
	userId,
	page = 1,
	filtro = "todas",
	limit = 12
) => {
	try {
		const response = await fetch(
			`http://localhost:3000/api/metas/getmeta/${userId}?page=${page}&limit=${limit}&filtro=${filtro}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		const data = await response.json();

		if (!data.success) {
			return { success: false, message: data.message };
		}

		return {
			success: true,
			data: data.data,
			total: data.total,
			message: data.message,
		};
	} catch (error) {
		return {
			success: false,
			message: "Erro ao conectar-se ao servidor: " + error.message,
		};
	}
};

export const createMeta = async (metaData) => {
	try {
		const result = await fetch("http://localhost:3000/api/metas/addmeta", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id_user: metaData.userId,
				titulo_meta: metaData.titulo_meta,
				descricao_meta: metaData.descricao_meta,
				data_finalizacao_meta: metaData.data_finalizacao_meta,
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

export const editMeta = async (metaData) => {
	try {
		const result = await fetch(
			`http://localhost:3000/api/metas/editmeta/${metaData.id_meta}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id_status: metaData.statusMeta }),
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
