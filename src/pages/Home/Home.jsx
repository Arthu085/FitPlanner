import Container from "../../components/Container";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import SideBar from "../../components/SideBar";
import Table from "../../components/Table";
import Buttons from "../../components/Buttons";
import Modal from "../../components/Modal";

import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { fetchTrainingSession } from "../../api/trainingSessionApi";

const Home = () => {
	const { user } = useAuth();
	const token = user?.token;
	const name = user?.name;

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [trainingSessions, setTrainingSessions] = useState([]);
	const [btnDisabled, setBtnDisabled] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);

	useEffect(() => {
		const loadSessions = async () => {
			try {
				const data = await fetchTrainingSession(token);
				setTrainingSessions(data);
			} catch (error) {
				console.error("Erro ao buscar sessões de treino:", error);
			}
		};

		if (token) {
			loadSessions();
		}
	}, [token]);

	const headers = [
		{ label: "Treino", key: "treino" },
		{ label: "Data Iniciado", key: "iniciado" },
		{ label: "Data Finalizado", key: "finalizado" },
		{ label: "Situação", key: "situacao" },
	];

	const data = trainingSessions.map((session) => ({
		treino: session.training?.title || "Sem título",
		iniciado: new Date(session.started_at).toLocaleString(),
		finalizado: session.finished_at
			? new Date(session.finished_at).toLocaleString()
			: "-",
		situacao: session.finished_at ? "Finalizado" : "Em andamento",
	}));

	return (
		<Container>
			<Header />
			<SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
			<Layout isSidebarOpen={isSidebarOpen} title="Dashboard">
				<section className="space-y-2 mt-7 mb-5">
					<h2 className="text-2xl font-semibold text-black dark:text-white">
						Olá, {name}
					</h2>
					<p className="text-black dark:text-white">
						Essa é a sua tela de <strong>dashboard</strong>.
					</p>
					<p className="text-black dark:text-white">
						Aqui você pode visualizar todas as suas{" "}
						<strong>sessões de treino</strong>.
					</p>
				</section>
				<Table
					headers={headers}
					data={data}
					renderActions={(row) => (
						<div className="flex gap-2">
							{row.situacao === "Em andamento" && (
								<Buttons
									type={"success"}
									disabled={btnDisabled}
									text={"Finalizar"}
								/>
							)}
							<Buttons
								type={"primary"}
								disabled={btnDisabled}
								text={"Detalhes"}
								onClick={() => setModalOpen(true)}
							/>
							<Buttons
								type={"warning"}
								disabled={btnDisabled}
								text={"Excluir"}
							/>
						</div>
					)}
				/>
			</Layout>
			<Footer />
			<Modal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				title="Título do Modal"
				content={<p>Esse é um modal flexível usando Tailwind e React.</p>}
				actions={
					<>
						<button
							onClick={() => setModalOpen(false)}
							className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
							Fechar
						</button>
						<button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
							Confirmar
						</button>
					</>
				}
			/>
		</Container>
	);
};

export default Home;
