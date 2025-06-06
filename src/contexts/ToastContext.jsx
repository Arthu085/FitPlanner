import { createContext, useState, useCallback } from "react";
import ToastContainer from "../components/Toast";

export const ToastContext = createContext();

export function ToastProvider({ children }) {
	const [toasts, setToasts] = useState([]);

	const addToast = useCallback((message, type = "success") => {
		const id = Date.now();
		setToasts((prev) => [...prev, { id, message, type }]);

		setTimeout(() => {
			setToasts((prev) => prev.filter((toast) => toast.id !== id));
		}, 3000);
	}, []);

	return (
		<ToastContext.Provider value={{ addToast }}>
			{children}
			<ToastContainer toasts={toasts} />
		</ToastContext.Provider>
	);
}
