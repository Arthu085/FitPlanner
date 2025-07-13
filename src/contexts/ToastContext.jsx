import ToastContainer from "../components/Toast";

import { createContext, useState, useCallback, useRef, useEffect } from "react";
import { useLoading } from "../hooks/useLoading";

export const ToastContext = createContext();

export function ToastProvider({ children }) {
	const [toasts, setToasts] = useState([]);
	const { isLoading } = useLoading();
	const timeoutRefs = useRef(new Map());

	const addToast = useCallback((message, type = "success") => {
		const id = Date.now();
		setToasts((prev) => [...prev, { id, message, type }]);

		const timeoutId = setTimeout(() => {
			setToasts((prev) => prev.filter((toast) => toast.id !== id));
			timeoutRefs.current.delete(id);
		}, 5000);

		timeoutRefs.current.set(id, timeoutId);
	}, []);

	useEffect(() => {
		if (isLoading) {
			timeoutRefs.current.forEach((timeoutId) => {
				clearTimeout(timeoutId);
			});
		} else {
			setToasts((currentToasts) => {
				currentToasts.forEach((toast) => {
					if (timeoutRefs.current.has(toast.id)) {
						const timeoutId = setTimeout(() => {
							setToasts((prev) => prev.filter((t) => t.id !== toast.id));
							timeoutRefs.current.delete(toast.id);
						}, 5000);

						timeoutRefs.current.set(toast.id, timeoutId);
					}
				});
				return currentToasts;
			});
		}
	}, [isLoading]);

	return (
		<ToastContext.Provider value={{ addToast }}>
			{children}
			{!isLoading && <ToastContainer toasts={toasts} />}
		</ToastContext.Provider>
	);
}
