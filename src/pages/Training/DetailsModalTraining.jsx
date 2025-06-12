import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { fetchTrainingDetails } from "../../api/trainingApi";

import Modal from "../../components/Modal";
import Buttons from "../../components/Buttons";
import LoadingScreen from "../../components/LoadingScreen";

export default function DetailsModalTraining({
	id_training,
	openDetailsModal,
	onClose,
}) {
	const { user } = useAuth();
	const token = user?.token;
	const addToast = useToast();

	const [details, setDetails] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const loadDetails = async () => {
			setLoading(true);
			try {
				const data = await fetchTrainingDetails(token, id_training);
				setDetails(data);
			} catch (error) {
				addToast(error.message || "Erro ao buscar detalhes da sessão", "error");
				onClose();
			} finally {
				setLoading(false);
			}
		};

		if (token && openDetailsModal) {
			loadDetails();
		}
	}, [token, openDetailsModal, id_training]);

	return (
		<>
			{loading && <LoadingScreen />}
			<Modal
				isOpen={openDetailsModal}
				onClose={onClose}
				title="Detalhes do treino"
				content={
					<div className="space-y-4">
						<h2 className="text-xl font-bold">
							{details.title || "Sem título"}
						</h2>

						{details.exercise_workout && details.exercise_workout.length > 0 ? (
							details.exercise_workout.map((exercise) => (
								<div key={exercise.id_exercise_workout}>
									<p>
										<strong>Exercício:</strong> {exercise.exercise.name}
									</p>
									<p>
										<strong>Descrição:</strong> {exercise.exercise.description}
									</p>
									<p>
										<strong>Grupo Muscular:</strong>{" "}
										{exercise.exercise.muscle_group.name}
									</p>
									<p>
										<strong>Séries:</strong> {exercise.series}
									</p>
									<p>
										<strong>Repetições:</strong> {exercise.repetitions}
									</p>
									<div className="border-b border-gray-300 dark:border-gray-600 mt-5"></div>
								</div>
							))
						) : (
							<div>
								<p>Não há exercícios ainda nessa sessão de treino</p>
								<div className="border-b border-gray-300 dark:border-gray-600 mt-5"></div>
							</div>
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
		</>
	);
}
