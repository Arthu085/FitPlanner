import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { editTraining } from "../../api/trainingApi";
import { useForm } from "../../hooks/useForm";

import Modal from "../../components/Modal";
import Buttons from "../../components/Buttons";
import LoadingScreen from "../../components/LoadingScreen";
import Form from "../../components/Form";

export default function EditModalTraining({
	id_training,
	openEditModal,
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

	const handleCreateTraining = async (formData) => {
		if (btnDisabled) return;

		if (!formData.exercise || formData.exercise.length === 0) {
			addToast("Selecione ao menos um exercício", "error");
			return;
		}

		// Transforma o array para o formato esperado pelo backend
		const exercises = formData.exercise.map((ex) => ({
			id_exercise: ex.id_exercise ?? ex.value, // se não tiver id_exercise, usa value
			series: ex.series || 3, // padrão 3 se não existir
			repetitions: ex.repetitions || 10, // padrão 10 se não existir
		}));

		// Remove propriedades extras, pega só as necessárias
		const dataToSend = {
			...formData,
			exercises,
		};
		delete dataToSend.exercise;

		setBtnDisabled(true);
		setLoading(true);

		try {
			const data = await createTraining(token, dataToSend);
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
		if (openEditModal) {
			resetForm();
		}
	}, [openEditModal]);

	const { values, handleChange, handleSubmit, resetForm } = useForm(
		{ exercise: [] },
		handleCreateTraining
	);

	return (
		<>
			{loading && <LoadingScreen />}
			<Modal
				isOpen={openEditModal}
				onClose={onClose}
				title="Editar treino"
				content={
					<div className="space-y-4">
						<Form
							handleChange={handleChange}
							handleSubmit={handleSubmit}
							exerciseOptions={exerciseOptions}
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
