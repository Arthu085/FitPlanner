import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { deleteExercise } from "../../api/exerciseApi";
import { useToast } from "../../hooks/useToast";

import Modal from "../../components/Modal";
import Buttons from "../../components/Buttons";
import LoadingScreen from "../../components/LoadingScreen";

export default function DeleteModalExercise({
	id_exercise,
	openDeleteModal,
	onClose,
	reloadExercises,
}) {
	const { user } = useAuth();
	const token = user?.token;
	const addToast = useToast();

	const [loading, setLoading] = useState(false);
	const [btnDisabled, setBtnDisabled] = useState(false);

	const handleDeleteExercise = async () => {
		if (btnDisabled) return;
		setBtnDisabled(true);
		setLoading(true);
		try {
			const data = await deleteExercise(token, id_exercise);
			addToast(data.message);
			await reloadExercises();
			onClose();
		} catch (error) {
			addToast(error.message || "Erro ao deletar exercício", "error");
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
				title="Deletar exercício"
				content={
					<div className="space-y-4">
						<h2 className="text-xl font-bold">
							Tem certeza que deseja excluir o exercício de nº {id_exercise}?
							<div className="border-b border-gray-300 dark:border-gray-600 mt-5"></div>
						</h2>
					</div>
				}
				actions={
					<div className="flex gap-3">
						<Buttons
							type={"warning"}
							text={"Excluir"}
							onClick={handleDeleteExercise}
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
