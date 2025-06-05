import { useState } from "react";
import {
	login as loginRequest,
	register as registerRequest,
} from "../api/authApi";

export function useAuth() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const login = async (data) => {
		setLoading(true);
		setError(null);
		try {
			const res = await loginRequest(data);
			setUser(res.user);
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
	};

	return {
		user,
		login,
		logout,
		register,
		loading,
		error,
		isAuthenticated: !!user,
	};
}
