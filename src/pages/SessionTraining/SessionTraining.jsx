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
import { fetchTrainingSession } from "../../api/trainingSessionApi";

const SessionTraining = () => {
	const { user } = useAuth();
	const addToast = useToast();
	const token = user?.token;

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [loading, setLoading] = useState(false);
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
						renderActions={(item) => (
							<div className="flex flex-row items-center justify-between w-full">
								<div></div>
								<div className="flex gap-3">
									<Buttons type={"primary"} text={`Editar`} width="w-24" />
									<Buttons type={"warning"} text={`Excluir`} width="w-24" />
								</div>
							</div>
						)}
					/>
				</Layout>
				<Footer />
			</Container>
		</>
	);
};

export default SessionTraining;
