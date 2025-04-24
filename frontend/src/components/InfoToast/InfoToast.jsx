import "./InfoToast.css";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";

const InfoToast = ({ message, show, onClose }) => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (show) {
			setVisible(true);

			// Inicia fade-out depois de 4.5s
			const fadeTimer = setTimeout(() => setVisible(false), 4500);

			// Remove do DOM depois de 5s
			const closeTimer = setTimeout(() => {
				onClose?.();
			}, 5000);

			return () => {
				clearTimeout(fadeTimer);
				clearTimeout(closeTimer);
			};
		}
	}, [show, onClose]);

	if (!show || !message) return null;

	return (
		<div className={`info-toast ${!visible ? "hide" : ""}`}>
			<Info size={20} className="toast-icon" />
			<span>{message}</span>
		</div>
	);
};

export default InfoToast;
