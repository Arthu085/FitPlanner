import { useEffect, useState } from "react";
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
	exercises = [],
}) {
	const { user } = useAuth();
	const token = user?.token;
	const addToast = useToast();

	const [loading, setLoading] = useState(false);
	const [btnDisabled, setBtnDisabled] = useState(false);

	const exerciseOptions = exercises.map((exercise) => ({
		value: exercise.id,
		label: exercise.name,
	}));

	const fields = [
		{
			label: "Título",
			type: "text",
			name: "title",
			required: true,
			placeholder: "Digite o título do treino",
		},
		{
			label: "Exercício(s)",
			type: "multiselect",
			name: "exercise",
			required: true,
			placeholder: "Selecione o exercício",
			options: exerciseOptions,
		},
	];

	const handleCreateTraining = async () => {
		if (btnDisabled) return;

		if (!values.exercise || values.exercise.length === 0) {
			addToast("Selecione ao menos um exercício", "error");
			return;
		}

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

	useEffect(() => {
		if (openCreateModal) {
			resetForm();
		}
	}, [openCreateModal]);

	const { values, handleChange, handleSubmit, resetForm } = useForm(
		{ exercise: [] },
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
