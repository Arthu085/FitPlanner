import Container from "../../components/Container";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import SideBar from "../../components/SideBar";
import Table from "../../components/Table";
import Buttons from "../../components/Buttons";
import DetailsModalHome from "./DetailsModalHome";
import DeleteModalHome from "./DeleteModalHome";
import FinishModalHome from "./FinishModalHome";
import LoadingScreen from "../../components/LoadingScreen";

import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { fetchTrainingSession } from "../../api/trainingSessionApi";
import { useToast } from "../../hooks/useToast";

const Home = () => {
	const { user } = useAuth();
	const token = user?.token;
	const name = user?.name;
	const addToast = useToast();

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [trainingSessions, setTrainingSessions] = useState([]);
	const [detailsModal, setDetailsModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [finishModal, setFinishModal] = useState(false);
	const [selectedSessionId, setSelectedSessionId] = useState(null);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);

	const loadSessions = async (pageToLoad) => {
		try {
			setLoading(true);
			const data = await fetchTrainingSession(token, pageToLoad);
			setTrainingSessions(data);
			setPage(pageToLoad);
		} catch (error) {
			addToast(error.message || "Erro ao buscar sessões de treinos", "error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (token) {
			loadSessions(1);
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

	const handleOpenFinish = (id) => {
		setSelectedSessionId(id);
		setFinishModal(true);
	};

	const headers = [
		{ label: "Treino", key: "training" },
		{ label: "Data Iniciado", key: "started" },
		{ label: "Data Finalizado", key: "finished" },
		{ label: "Situação", key: "situation" },
	];

	const data =
		trainingSessions?.data?.map((session) => ({
			id_training_session: session.id_training_session,
			training: session.training?.title || "Sem título",
			started: new Date(session.started_at).toLocaleString(),
			finished: session.finished_at
				? new Date(session.finished_at).toLocaleString()
				: "-",
			situation: session.finished_at ? "Finalizado" : "Em andamento",
		})) || [];

	return (
		<>
			{loading && <LoadingScreen />}

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
							Aqui você pode visualizar, finalizar e excluir todas as suas{" "}
							<strong>sessões de treino</strong>.
						</p>
					</section>

					<Table
						headers={headers}
						data={data}
						renderActions={(row) => (
							<div className="flex gap-2">
								{row.situation === "Em andamento" && (
									<Buttons
										type={"success"}
										text={"Finalizar"}
										onClick={() => handleOpenFinish(row.id_training_session)}
									/>
								)}
								<Buttons
									type={"info"}
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
					{data.length > 0 && (
						<div className="flex flex-row mt-5 gap-4 items-center justify-end">
							<Buttons
								type={"primary"}
								text={"Anterior"}
								onClick={() => {
									const prevPage = Math.max(page - 1, 1);
									loadSessions(prevPage);
								}}
								disabled={trainingSessions.pagination?.page === 1}
								width="w-30"
								loadingText="Anterior"
							/>

							<Buttons
								type={"primary"}
								text={"Próximo"}
								onClick={() => {
									const nextPage = Math.min(
										page + 1,
										trainingSessions.pagination?.totalPages || page + 1
									);
									loadSessions(nextPage);
								}}
								disabled={
									trainingSessions.pagination?.page ===
									trainingSessions.pagination?.totalPages
								}
								width="w-30"
								loadingText="Próximo"
							/>
						</div>
					)}
					<DetailsModalHome
						openDetailsModal={detailsModal}
						onClose={() => setDetailsModal(false)}
						id_training_session={selectedSessionId}
					/>
					<DeleteModalHome
						openDeleteModal={deleteModal}
						onClose={() => setDeleteModal(false)}
						id_training_session={selectedSessionId}
						reloadSessions={loadSessions}
					/>
					<FinishModalHome
						openFinishModal={finishModal}
						onClose={() => setFinishModal(false)}
						id_training_session={selectedSessionId}
						reloadSessions={loadSessions}
					/>
				</Layout>
				<Footer />
			</Container>
		</>
	);
};

export default Home;
