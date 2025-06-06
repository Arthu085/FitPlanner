import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { useEffect, useRef } from "react";

export default function PrivateRoute() {
	const { user } = useAuth();
	const addToast = useToast();
	const toastShownRef = useRef(false);

	useEffect(() => {
		const manuallyLoggedOut = localStorage.getItem("manualLogout");

		if (!user && !toastShownRef.current && !manuallyLoggedOut) {
			addToast("Faça login para usar o sistema", "error");
			toastShownRef.current = true;
		}

		if (manuallyLoggedOut) {
			localStorage.removeItem("manualLogout"); // limpa a flag
		}
	}, [user, addToast]);

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
}
