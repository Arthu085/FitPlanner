import { useState, useCallback } from "react";

export const useToast = () => {
	const [errorMessage, setErrorMessage] = useState("");
	const [showError, setShowError] = useState(false);

	const [successMessage, setSuccessMessage] = useState("");
	const [showSuccess, setShowSuccess] = useState(false);

	const [infoMessage, setInfoMessage] = useState("");
	const [showInfo, setShowInfo] = useState(false);

	const showErrorToast = useCallback((message) => {
		setErrorMessage(message);
		setShowError(true);
	}, []);

	const showSuccessToast = useCallback((message) => {
		setSuccessMessage(message);
		setShowSuccess(true);
	}, []);

	const showInfoToast = useCallback((message) => {
		setInfoMessage(message);
		setShowInfo(true);
	}, []);

	const hideToasts = useCallback(() => {
		setShowError(false);
		setShowSuccess(false);
		setShowInfo(false);
	}, []);

	return {
		// toast states
		errorMessage,
		showError,
		successMessage,
		showSuccess,
		infoMessage,
		showInfo,

		// toast handlers
		showErrorToast,
		showSuccessToast,
		showInfoToast,
		hideToasts,
	};
};
