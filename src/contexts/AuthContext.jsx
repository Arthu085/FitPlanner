import { createContext, useState } from "react";
import {
	login as loginRequest,
	register as registerRequest,
} from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const saved = localStorage.getItem("user");
		return saved ? JSON.parse(saved) : null;
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const login = async (data) => {
		setLoading(true);
		setError(null);
		try {
			const res = await loginRequest(data);
			setUser(res);
			localStorage.setItem("user", JSON.stringify(res));
			return res;
		} catch (error) {
			setError(error.message || "Erro ao fazer login");
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const register = async (data) => {
		setLoading(true);
		setError(null);
		try {
			const res = await registerRequest(data);
			return res;
		} catch (error) {
			setError(error.message || "Erro ao fazer cadastro");
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
	};

	const isAuthenticated = !!user;

	return (
		<AuthContext.Provider
			value={{
				user,
				login,
				logout,
				register,
				loading,
				error,
				isAuthenticated,
			}}>
			{children}
		</AuthContext.Provider>
	);
};
