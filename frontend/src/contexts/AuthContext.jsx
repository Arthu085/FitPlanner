import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [userId, setUserId] = useState(localStorage.getItem("id") || null);
	const navigate = useNavigate();

	useEffect(() => {
		if (!userId) {
			localStorage.removeItem("token");
			localStorage.removeItem("id");
		}
	}, [userId]);

	const login = async (email, password) => {
		try {
			const response = await fetch(
				"http://localhost:3000/api/loginregister/logar",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email_user: email,
						password_user: password,
					}),
				}
			);

			const data = await response.json();

			if (data.success) {
				localStorage.setItem("token", data.token);
				localStorage.setItem("id", data.id_user);
				setUserId(data.id_user);
				navigate("/home");
			} else {
				alert(data.message);
			}
		} catch (error) {
			alert("Erro ao conectar-se ao servidor,", error.message);
		}
	};

	const register = async (name, lastName, email, password) => {
		try {
			const response = await fetch(
				"http://localhost:3000/api/loginregister/registrar",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name_user: name,
						lastname_user: lastName,
						email_user: email,
						password_user: password,
					}),
				}
			);

			const data = await response.json();
			if (!response.ok) {
				alert(
					data.message === "Email já cadastrado."
						? "Este email já foi registrado. Tente outro."
						: "Erro ao registrar: " + data.message
				);
				return false;
			}

			alert("Conta registrada com sucesso.");
			return true;
		} catch (error) {
			alert("Erro ao registrar conta. Detalhes: " + error.message);
			return false;
		}
	};

	const logout = () => {
		setUserId(null);
		localStorage.removeItem("id");
		localStorage.removeItem("token");
		navigate("/");
	};

	return (
		<AuthContext.Provider value={{ userId, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
