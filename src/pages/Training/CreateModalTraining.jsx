import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { createTraining } from "../../api/trainingApi";
import { useForm } from "../../hooks/useForm";

import Modal from "../../components/Modal";
import Buttons from "../../components/Buttons";
import LoadingScreen from "../../components/LoadingScreen";
import Form from "../../components/Form";

export default function CreateModalTraining({
	openCreateModal,
	onClose,
	reloadTraining,
}) {
	const { user } = useAuth();
	const token = user?.token;
	const addToast = useToast();

	const [loading, setLoading] = useState(false);
	const [btnDisabled, setBtnDisabled] = useState(false);

	const fields = [
		{
			label: "Título",
			type: "text",
			name: "title",
			required: true,
			placeholder: "Digite o título do treino",
		},
		{
			label: "Exercício",
			type: "select",
			name: "exercise",
			required: true,
			placeholder: "Selecione o exercício",
		},
	];

	const handleCreateTraining = async () => {
		if (btnDisabled) return;
		setBtnDisabled(true);
		setLoading(true);
		try {
			const data = await createTraining(token, values);
			addToast(data.message);
			await reloadTraining();
			onClose();
			resetForm();
		} catch (error) {
			addToast(error.message || "Erro ao criar treino", "error");
			onClose();
		} finally {
			setLoading(false);
			setBtnDisabled(false);
		}
	};

	const { values, handleChange, handleSubmit, resetForm } = useForm(
		{},
		handleCreateTraining
	);

	return (
		<>
			{loading && <LoadingScreen />}
			<Modal
				isOpen={openCreateModal}
				onClose={onClose}
				title="Criar treino"
				content={
					<div className="space-y-4">
						<Form
							handleChange={handleChange}
							handleSubmit={handleSubmit}
							fields={fields}
							values={values}
							btnTitle={"Salvar"}
							btnDisabled={btnDisabled}
							btnType={"success"}
							changeClass={
								"bg-white dark:bg-gray-800 p-5 w-full mx-auto transition-colors duration-300"
							}
						/>
					</div>
				}
				size="big"
				actions={
					<div className="flex gap-3">
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
