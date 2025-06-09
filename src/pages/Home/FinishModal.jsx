import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
	finishTrainingSession,
	fetchExerciseByTrainingAndSession,
} from "../../api/trainingSessionApi";
import { useToast } from "../../hooks/useToast";

import Modal from "../../components/Modal";
import Buttons from "../../components/Buttons";
import LoadingScreen from "../../components/LoadingScreen";

export default function FinishModal({
	id_training_session,
	openFinishModal,
	onClose,
	reloadSessions,
}) {
	const { user } = useAuth();
	const token = user?.token;
	const addToast = useToast();

	const [loading, setLoading] = useState(false);
	const [btnDisabled, setBtnDisabled] = useState(false);

	const handleFinishTrainingSession = async () => {
		if (btnDisabled) return;
		setBtnDisabled(true);
		setLoading(true);
		try {
			const exercises = await fetchExerciseByTrainingAndSession(
				token,
				id_training_session
			);

			if (exercises) {
				const data = await finishTrainingSession(
					token,
					id_training_session,
					exercises
				);
				addToast(data.message);
				await reloadSessions();
				onClose();
			}

			return;
		} catch (error) {
			addToast(error.message || "Erro ao finalizar sessão", "error");
			onClose();
		} finally {
			setLoading(false);
			setBtnDisabled(false);
		}
	};

	return (
		<>
			{loading && <LoadingScreen />}
			<Modal
				isOpen={openFinishModal}
				onClose={onClose}
				title="Finalizar sessão de treino"
				content={
					<div className="space-y-4">
						<h2 className="text-xl font-bold">
							Tem certeza de que deseja finalizar a sessão de treino nº{" "}
							{id_training_session} sem registrar alterações em séries,
							repetições, peso ou observações?
						</h2>
						<div className="border-b border-gray-300 dark:border-gray-600 mt-5"></div>
					</div>
				}
				actions={
					<div className="flex gap-3">
						<Buttons
							type={"success"}
							text={"Finalizar"}
							width="w-24"
							disabled={btnDisabled}
							onClick={handleFinishTrainingSession}
						/>
						<Buttons
							type={"primary"}
							text={"Fechar"}
							onClick={onClose}
							width="w-24"
						/>
					</div>
				}
			/>
		</>
	);
}
