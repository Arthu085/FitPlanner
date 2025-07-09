import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { useForm } from "../../hooks/useForm";
import { createExercise } from "../../api/exerciseApi";

import Modal from "../../components/Modal";
import Buttons from "../../components/Buttons";
import LoadingScreen from "../../components/LoadingScreen";
import Form from "../../components/Form";

export default function CreateModalExercise({
	openCreateModal,
	onClose,
	reloadExercise,
	muscleGroups = [],
}) {
	const { user } = useAuth();
	const formRef = useRef();
	const addToast = useToast();

	const token = user?.token;

	const [loading, setLoading] = useState(false);
	const [btnDisabled, setBtnDisabled] = useState(false);

	const fields = [
		{
			label: "Nome",
			type: "text",
			name: "name",
			required: true,
			placeholder: "Digite o nome do exercício",
		},
		{
			label: "Descrição",
			type: "textarea",
			name: "description",
			required: true,
			placeholder: "Digite uma descrição para o exercício",
		},
		{
			label: "Grupo Muscular",
			type: "select",
			name: "id_muscle_group",
			required: true,
			placeholder: "Selecione o grupo muscular",
			options: muscleGroups.map((group) => ({
				value: group.id,
				label: group.name,
			})),
		},
	];

	const handleCreateExercise = async (formData) => {
		if (btnDisabled) return;

		setBtnDisabled(true);
		setLoading(true);

		try {
			const data = await createExercise(token, formData);
			addToast(data.message);
			await reloadExercise();
			onClose();
			resetForm();
		} catch (error) {
			addToast(error.message || "Erro ao criar exercício", "error");
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
		{},
		handleCreateExercise
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
				title="Criar exercício"
				content={
					<div className="space-y-4">
						<Form
							ref={formRef}
							handleChange={handleChange}
							handleSubmit={handleSubmit}
							fields={fields}
							values={values}
							changeClass={
								"bg-white dark:bg-gray-800 p-5 w-full mx-auto transition-colors duration-300"
							}
							menuHeight="150px"
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
