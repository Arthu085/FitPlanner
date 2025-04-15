export const fetchUser = async (userId) => {
	if (userId) {
		try {
			const response = await fetch(
				`http://localhost:3000/api/user/getuser/${userId}`
			);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Erro ao buscar usuário", error);
			throw error;
		}
	}
};
