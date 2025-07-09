import { useEffect, useState, useRef } from "react";
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
	const formRef = useRef();
	const addToast = useToast();

	const token = user?.token;

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

		if (formData.title.trim().length < 3) {
			addToast("O nome do treino deve ter pelo menos 3 letras", "info");
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

	const handleFormSubmit = () => {
		if (formRef.current) {
			formRef.current.requestSubmit();
		}
	};

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
