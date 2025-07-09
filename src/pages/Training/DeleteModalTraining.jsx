import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { deleteTraining } from "../../api/trainingApi";
import { useToast } from "../../hooks/useToast";

import Modal from "../../components/Modal";
import Buttons from "../../components/Buttons";
import LoadingScreen from "../../components/LoadingScreen";

export default function DeleteModalTraining({
	id_training,
	openDeleteModal,
	onClose,
	reloadTraining,
}) {
	const { user } = useAuth();
	const token = user?.token;
	const addToast = useToast();

	const [loading, setLoading] = useState(false);
	const [btnDisabled, setBtnDisabled] = useState(false);

	const handleDeleteTraining = async () => {
		if (btnDisabled) return;
		setBtnDisabled(true);
		setLoading(true);
		try {
			const data = await deleteTraining(token, id_training);
			addToast(data.message);
			await reloadTraining();
			onClose();
		} catch (error) {
			addToast(error.message || "Erro ao deletar treino", "error");
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
				title="Deletar treino"
				content={
					<div className="space-y-4">
						<h2 className="text-xl font-bold">
							Tem certeza que deseja excluir o treino de nº {id_training}?
							<div className="border-b border-gray-300 dark:border-gray-600 mt-5"></div>
						</h2>
					</div>
				}
				actions={
					<div className="flex gap-3">
						<Buttons
							type={"warning"}
							text={"Excluir"}
							onClick={handleDeleteTraining}
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
