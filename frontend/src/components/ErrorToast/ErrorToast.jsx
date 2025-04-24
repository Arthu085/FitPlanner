import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import "./ErrorToast.css";

const ErrorToast = ({ message, show, onClose }) => {
	useEffect(() => {
		if (!show) return;

		const timer = setTimeout(() => {
			onClose?.();
		}, 5000);

		return () => clearTimeout(timer);
	}, [show, onClose]);

	if (!show || !message) return null;

	return (
		<div className="error-toast">
			<AlertCircle size={20} className="toast-icon" />
			<span>{message}</span>
		</div>
	);
};

export default ErrorToast;
