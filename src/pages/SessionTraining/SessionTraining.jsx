import Buttons from "../../components/Buttons";
import Container from "../../components/Container";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import SideBar from "../../components/SideBar";
import Card from "../../components/Card";
import LoadingScreen from "../../components/LoadingScreen";

import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { fetchTraining } from "../../api/trainingApi";
import {
	fetchTrainingSession,
	startTrainingSession,
} from "../../api/trainingSessionApi";
import { useNavigate } from "react-router-dom";

const SessionTraining = () => {
	const { user } = useAuth();
	const addToast = useToast();
	const token = user?.token;
	const navigate = useNavigate();

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [btnDisabled, setBtnDisabled] = useState(false);
	const [training, setTraining] = useState([]);
	const [trainingSessions, setTrainingSessions] = useState([]);

	const loadSessions = async () => {
		try {
			setLoading(true);
			const data = await fetchTrainingSession(token, 1, 0);
			setTrainingSessions(data);
		} catch (error) {
			addToast(error.message || "Erro ao buscar sessões de treinos", "error");
		} finally {
			setLoading(false);
		}
	};

	const loadTraining = async () => {
		try {
			setLoading(true);
			const data = await fetchTraining(token);
			setTraining(data);
		} catch (error) {
			addToast(error.message || "Erro ao buscar treinos", "error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadTraining();
		loadSessions();
	}, [token]);

	const handleStartSession = async (trainingId) => {
		if (btnDisabled) return;

		setBtnDisabled(true);
		setLoading(true);

		try {
			const data = await startTrainingSession(token, trainingId);
			const selectedTraining = training.find((t) => t.id === trainingId);
			const trainingTitle = selectedTraining?.title || "Treino em andamento";

			navigate(`/session/training/active/${data.session.id}`, {
				state: {
					session: data.session,
					trainingId,
					trainingTitle,
				},
			});
			addToast(data.message);
		} catch (error) {
			addToast(error.message || "Erro ao iniciar sessão de treino", "error");
			setLoading(false);
			setBtnDisabled(false);
		}
	};

	const handleFinishSession = async (sessionId, trainingId) => {
		if (btnDisabled) return;

		setBtnDisabled(true);
		setLoading(true);

		try {
			const selectedTraining = training.find((t) => t.id === trainingId);
			const trainingTitle = selectedTraining?.title || "Treino em andamento";
			navigate(`/session/training/active/${sessionId}`, {
				state: {
					trainingTitle,
				},
			});
		} catch (error) {
			addToast(error.message || "Sessão de treino não encontrada", "error");
			setLoading(false);
			setBtnDisabled(false);
		}
	};

	return (
		<>
			{loading && <LoadingScreen />}

			<Container>
				<Header />
				<SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
				<Layout isSidebarOpen={isSidebarOpen} title="Sessão de Treinos">
					<section className="space-y-2 mt-7 mb-5 flex flex-row justify-between items-center">
						<div>
							<p className="text-black dark:text-white">
								Essa é a sua tela de <strong>sessão de treino</strong>.
							</p>
							<p className="text-black dark:text-white">
								Aqui você pode visualizar, iniciar e finalizar{" "}
								<strong>treinos</strong>.
							</p>
						</div>
					</section>

					<Card
						data={training}
						title={"Treino: "}
						renderActions={(item) => {
							const session =
								trainingSessions?.data?.find(
									(s) => s.id_training === item.id
								) || null;

							return (
								<div className="flex flex-row items-center justify-between w-full">
									<div className="flex gap-3">
										{session ? (
											session.finished_at !== null ? (
												<Buttons
													title="Iniciar treino"
													type="success"
													text="Iniciar"
													width="w-24"
													onClick={() => handleStartSession(item.id)}
												/>
											) : (
												<Buttons
													title="Finalizar treino"
													type="primary"
													text="Finalizar"
													width="w-24"
													onClick={() =>
														handleFinishSession(
															session.id_training_session,
															item.id
														)
													}
												/>
											)
										) : (
											<Buttons
												title="Iniciar treino"
												type="success"
												text="Iniciar"
												width="w-24"
												onClick={() => handleStartSession(item.id)}
											/>
										)}
									</div>
								</div>
							);
						}}
					/>
				</Layout>
				<Footer />
			</Container>
		</>
	);
};

export default SessionTraining;
