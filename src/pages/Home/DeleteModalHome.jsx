import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { deleteTrainingSession } from "../../api/trainingSessionApi";
import { useToast } from "../../hooks/useToast";

import Modal from "../../components/Modal";
import Buttons from "../../components/Buttons";
import LoadingScreen from "../../components/LoadingScreen";

export default function DeleteModalHome({
	id_training_session,
	openDeleteModal,
	onClose,
	reloadSessions,
}) {
	const { user } = useAuth();
	const token = user?.token;
	const addToast = useToast();

	const [loading, setLoading] = useState(false);
	const [btnDisabled, setBtnDisabled] = useState(false);

	const handleDeleteTrainingSession = async () => {
		if (btnDisabled) return;
		setBtnDisabled(true);
		setLoading(true);
		try {
			const data = await deleteTrainingSession(token, id_training_session);
			addToast(data.message);
			await reloadSessions();
			onClose();
		} catch (error) {
			addToast(error.message || "Erro ao deletar sessão", "error");
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
				isOpen={openDeleteModal}
				onClose={onClose}
				title="Deletar sessão de treino"
				content={
					<div className="space-y-4">
						<h2 className="text-xl font-bold">
							Tem certeza que deseja excluir a sessão de treino de nº{" "}
							{id_training_session}?
							<div className="border-b border-gray-300 dark:border-gray-600 mt-5"></div>
						</h2>
					</div>
				}
				actions={
					<div className="flex gap-3">
						<Buttons
							type={"warning"}
							text={"Excluir"}
							onClick={handleDeleteTrainingSession}
							width="w-24"
							disabled={btnDisabled}
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
