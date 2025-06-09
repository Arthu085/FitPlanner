import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { fetchTrainingSessionById } from "../../api/trainingSessionApi";

import Modal from "../../components/Modal";
import Buttons from "../../components/Buttons";

export default function DetailsModal({
	id_training_session,
	openDetailsModal,
	onClose,
}) {
	const { user } = useAuth();
	const token = user?.token;

	const [details, setDetails] = useState([]);

	useEffect(() => {
		const loadDetails = async () => {
			try {
				const data = await fetchTrainingSessionById(token, id_training_session);
				setDetails(data);
			} catch (error) {
				console.error("Erro ao buscar sessões de treino:", error);
			}
		};

		if (token && openDetailsModal) {
			loadDetails();
		}
	}, [token, openDetailsModal, id_training_session]);

	console.log(id_training_session);

	return (
		<Modal
			isOpen={openDetailsModal}
			onClose={onClose}
			title="Detalhes da sessão de treino"
			content={
				<div className="space-y-4">
					<h2 className="text-xl font-bold">
						{details.training?.title || "Sem título"}
					</h2>

					{details.exercise_session && details.exercise_session.length > 0 ? (
						details.exercise_session.map((exercise) => (
							<div key={exercise.id_exercise_session}>
								<p>
									<strong>Exercício:</strong> {exercise.exercise.name}
								</p>
								<p>
									<strong>Descrição:</strong> {exercise.exercise.description}
								</p>
								<p>
									<strong>Séries:</strong> {exercise.series}
								</p>
								<p>
									<strong>Repetições:</strong> {exercise.repetitions}
								</p>
								{exercise.weight && (
									<p>
										<strong>Carga:</strong> {exercise.weight} kg
									</p>
								)}
								{exercise.notes && (
									<p>
										<strong>Notas:</strong> {exercise.notes}
									</p>
								)}
								<div className="border-b border-gray-300 dark:border-gray-600 mt-5"></div>
							</div>
						))
					) : (
						<p>
							Não há exercícios ainda nessa sessão de treino
							<div className="border-b border-gray-300 dark:border-gray-600 mt-5"></div>
						</p>
					)}
				</div>
			}
			actions={
				<Buttons
					type={"primary"}
					text={"Fechar"}
					onClick={onClose}
					width="w-24"
				/>
			}
			size="big"
		/>
	);
}
