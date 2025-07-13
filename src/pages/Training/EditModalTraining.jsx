import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { editTraining } from "../../api/trainingApi";
import { useForm } from "../../hooks/useForm";
import { useLoading } from "../../hooks/useLoading";

import Modal from "../../components/Modal";
import Buttons from "../../components/Buttons";
import LoadingScreen from "../../components/LoadingScreen";
import Form from "../../components/Form";

export default function EditModalTraining({
	id_training,
	trainingData,
	openEditModal,
	onClose,
	reloadTraining,
	exercises = [],
}) {
	const { user } = useAuth();
	const formRef = useRef();
	const addToast = useToast();
	const { isLoading, setIsLoading } = useLoading();

	const token = user?.token;

	const [btnDisabled, setBtnDisabled] = useState(false);

	const { values, handleChange, handleSubmit, resetForm } = useForm(
		{ title: "", exercise: [] },
		handleEditTraining
	);

	useEffect(() => {
		if (openEditModal && trainingData && exercises.length > 0) {
			const initialValues = {
				title: trainingData.title || "",
				exercise: (trainingData.exercise_workout || []).map((ex) => ({
					value: ex.id_exercise,
					label:
						exercises.find((e) => e.id === ex.id_exercise)?.name || "Exercício",
					id_exercise: ex.id_exercise,
					id_exercise_workout: ex.id_exercise_workout,
					series: ex.series,
					repetitions: ex.repetitions,
				})),
			};
			resetForm(initialValues);
		}
	}, [trainingData, openEditModal, exercises]);

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

	async function handleEditTraining(formData) {
		if (btnDisabled) return;

		if (!formData.exercise || formData.exercise.length === 0) {
			addToast("Selecione ao menos um exercício", "error");
			return;
		}

		if (formData.title.trim().length < 3) {
			addToast("O nome do treino deve ter pelo menos 3 letras", "info");
			return;
		}

		const exercises = formData.exercise.map((ex) => {
			const data = {
				series: ex.series || 3,
				repetitions: ex.repetitions || 10,
			};

			if (ex.id_exercise_workout)
				data.id_exercise_workout = ex.id_exercise_workout;
			if (ex.id_exercise || ex.value)
				data.id_exercise = ex.id_exercise ?? ex.value;

			return data;
		});

		const dataToSend = {
			title: formData.title,
			exercises,
		};

		setBtnDisabled(true);
		setIsLoading(true);

		try {
			const response = await editTraining(token, id_training, dataToSend);
			addToast(response.message);
			await reloadTraining();
			onClose();
			resetForm();
		} catch (error) {
			if (error.message === "Nenhuma alteração foi feita") {
				addToast(error.message, "info");
			} else {
				addToast(error.message || "Erro ao editar treino", "error");
			}
		} finally {
			setIsLoading(false);
			setBtnDisabled(false);
		}
	}

	const handleFormSubmit = () => {
		if (formRef.current) {
			formRef.current.requestSubmit();
		}
	};

	return (
		<>
			{isLoading && <LoadingScreen />}
			<Modal
				isOpen={openEditModal}
				onClose={onClose}
				title="Editar treino"
				content={
					<div className="space-y-4">
						<Form
							ref={formRef}
							handleChange={handleChange}
							handleSubmit={handleSubmit}
							exerciseOptions={exerciseOptions}
							fields={fields}
							values={values}
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
							type={"success"}
							text={"Salvar"}
							onClick={handleFormSubmit}
							disabled={btnDisabled}
							width="w-24"
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
