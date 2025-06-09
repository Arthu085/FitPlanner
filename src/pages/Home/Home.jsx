import Container from "../../components/Container";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import SideBar from "../../components/SideBar";
import Table from "../../components/Table";
import Buttons from "../../components/Buttons";
import DetailsModal from "./detailsModal";

import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { fetchTrainingSession } from "../../api/trainingSessionApi";
import DeleteModal from "./DeleteModal";

const Home = () => {
	const { user } = useAuth();
	const token = user?.token;
	const name = user?.name;

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [trainingSessions, setTrainingSessions] = useState([]);
	const [detailsModal, setDetailsModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [selectedSessionId, setSelectedSessionId] = useState(null);

	const loadSessions = async () => {
		try {
			const data = await fetchTrainingSession(token);
			setTrainingSessions(data);
		} catch (error) {
			console.error("Erro ao buscar sessões de treino:", error);
		}
	};

	useEffect(() => {
		if (token) {
			loadSessions();
		}
	}, [token]);

	const handleOpenDetails = (id) => {
		setSelectedSessionId(id);
		setDetailsModal(true);
	};

	const handleOpenDelete = (id) => {
		setSelectedSessionId(id);
		setDeleteModal(true);
	};

	const headers = [
		{ label: "Treino", key: "training" },
		{ label: "Data Iniciado", key: "started" },
		{ label: "Data Finalizado", key: "finished" },
		{ label: "Situação", key: "situation" },
	];

	const data = trainingSessions.map((session) => ({
		id_training_session: session.id_training_session,
		training: session.training?.title || "Sem título",
		started: new Date(session.started_at).toLocaleString(),
		finished: session.finished_at
			? new Date(session.finished_at).toLocaleString()
			: "-",
		situation: session.finished_at ? "Finalizado" : "Em andamento",
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
							{row.situation === "Em andamento" && (
								<Buttons type={"success"} text={"Finalizar"} />
							)}
							<Buttons
								type={"primary"}
								text={"Detalhes"}
								onClick={() => handleOpenDetails(row.id_training_session)}
							/>
							<Buttons
								type={"warning"}
								text={"Excluir"}
								onClick={() => handleOpenDelete(row.id_training_session)}
							/>
						</div>
					)}
				/>
				<DetailsModal
					openDetailsModal={detailsModal}
					onClose={() => setDetailsModal(false)}
					id_training_session={selectedSessionId}
				/>
				<DeleteModal
					openDeleteModal={deleteModal}
					onClose={() => setDeleteModal(false)}
					id_training_session={selectedSessionId}
					reloadSessions={loadSessions}
				/>
			</Layout>
			<Footer />
		</Container>
	);
};

export default Home;
