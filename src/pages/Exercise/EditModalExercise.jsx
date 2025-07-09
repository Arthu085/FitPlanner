import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { useForm } from "../../hooks/useForm";
import { editExercise } from "../../api/exerciseApi";

import Modal from "../../components/Modal";
import Buttons from "../../components/Buttons";
import LoadingScreen from "../../components/LoadingScreen";
import Form from "../../components/Form";

export default function EditModalExercise({
	openEditModal,
	onClose,
	reloadExercise,
	exerciseData,
	id_exercise,
	muscleGroups = [],
}) {
	const { user } = useAuth();
	const formRef = useRef();
	const addToast = useToast();

	const token = user?.token;

	const [loading, setLoading] = useState(false);
	const [btnDisabled, setBtnDisabled] = useState(false);

	const { values, handleChange, handleSubmit, resetForm } = useForm(
		{ name: "", description: "", muscle_group: "" },
		handleEditExercise
	);

	useEffect(() => {
		if (openEditModal && exerciseData && muscleGroups) {
			const initialValues = {
				name: exerciseData.name || "",
				description: exerciseData.description || "",
				muscle_group: exerciseData.id_muscle_group || "",
			};
			resetForm(initialValues);
		}
	}, [exerciseData, openEditModal]);

	const muscleGroupsOptions = muscleGroups.map((muscle) => ({
		value: muscle.id,
		label: muscle.name,
	}));

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
			placeholder: "Digite a descrição do exercício",
		},
		{
			label: "Grupo Muscular",
			type: "select",
			name: "muscle_group",
			required: true,
			placeholder: "Selecione o grupo muscular",
			options: muscleGroupsOptions,
		},
	];

	const handleFormSubmit = () => {
		if (formRef.current) {
			formRef.current.requestSubmit();
		}
	};

	async function handleEditExercise(formData) {
		if (btnDisabled) return;

		if (formData.name.trim().length < 3) {
			addToast("O nome do exercício deve ter pelo menos 3 letras", "info");
			return;
		}

		setBtnDisabled(true);
		setLoading(true);

		try {
			const payload = {
				name: formData.name,
				description: formData.description,
				id_muscle_group: formData.muscle_group,
			};

			const response = await editExercise(token, id_exercise, payload);
			addToast(response.message);
			await reloadExercise();
			onClose();
			resetForm();
		} catch (error) {
			if (error.message === "Nenhuma alteração foi feita") {
				addToast(error.message, "info");
			} else {
				addToast(error.message || "Erro ao editar exercício", "error");
			}
		} finally {
			setLoading(false);
			setBtnDisabled(false);
		}
	}

	return (
		<>
			{loading && <LoadingScreen />}
			<Modal
				isOpen={openEditModal}
				onClose={onClose}
				title="Editar exercício"
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
