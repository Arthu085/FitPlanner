// react
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
			const response = await fetch("http://localhost:3000/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email_user: email,
					password_user: password,
				}),
			});

			const data = await response.json();

			if (!data.success) {
				return { success: data.success, message: data.message };
			}

			localStorage.setItem("token", data.token);
			localStorage.setItem("id", data.id_user);
			setUserId(data.id_user);
			return { success: true };
		} catch (error) {
			return {
				success: false,
				message: "Erro ao conectar-se ao servidor: " + error.message,
			};
		}
	};

	const register = async (email, password, name, lastName) => {
		try {
			const response = await fetch("http://localhost:3000/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email_user: email,
					password_user: password,
					name_user: name,
					lastname_user: lastName,
				}),
			});

			const data = await response.json();

			if (!data.success) {
				return { success: data.success, message: data.message };
			}

			return { success: true, message: data.message };
		} catch (error) {
			return {
				success: false,
				message: "Erro ao conectar-se ao servidor: " + error.message,
			};
		}
	};

	const logout = () => {
		setUserId(null);
		localStorage.removeItem("id");
		localStorage.removeItem("token");
		navigate("/");
	};

	const isLoggedIn = () => {
		if (!userId) {
			navigate("/");
			alert("Faça login no sistema");
			localStorage.removeItem("id");
			localStorage.removeItem("token");
		}
	};

	return (
		<AuthContext.Provider
			value={{ userId, login, register, logout, isLoggedIn }}>
			{children}
		</AuthContext.Provider>
	);
};
