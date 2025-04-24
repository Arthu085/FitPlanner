export const fetchUser = async (userId) => {
	if (userId) {
		try {
			const response = await fetch(
				`http://localhost:3000/api/user/getuser/${userId}`
			);
			const data = await response.json();

			if (!data.success) {
				return { success: false, message: data.message };
			}

			return { success: true, data: data.data };
		} catch (error) {
			return {
				success: false,
				message: "Erro ao conectar-se ao servidor: " + error.message,
			};
		}
	}
};
