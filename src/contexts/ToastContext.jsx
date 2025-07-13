import ToastContainer from "../components/Toast";

import { createContext, useState, useCallback } from "react";
import { useLoading } from "../hooks/useLoading";

export const ToastContext = createContext();

export function ToastProvider({ children }) {
	const [toasts, setToasts] = useState([]);
	const { isLoading } = useLoading();

	const addToast = useCallback(
		(message, type = "success") => {
			if (isLoading) return;

			const id = Date.now();
			setToasts((prev) => [...prev, { id, message, type }]);

			setTimeout(() => {
				setToasts((prev) => prev.filter((toast) => toast.id !== id));
			}, 3000);
		},
		[isLoading]
	);

	return (
		<ToastContext.Provider value={{ addToast }}>
			{children}
			<ToastContainer toasts={toasts} />
		</ToastContext.Provider>
	);
}
