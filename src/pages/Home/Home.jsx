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
import { useLoading } from "../../hooks/useLoading";

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
	const { isLoading, setIsLoading } = useLoading();
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [hasSearched, setHasSearched] = useState(false);

	const loadSessions = async (pageToLoad) => {
		try {
			setIsLoading(true);
			const data = await fetchTrainingSession(token, pageToLoad);
			setTrainingSessions(data);
			setPage(pageToLoad);
		} catch (error) {
			addToast(error.message || "Erro ao buscar sessões de treinos", "error");
		} finally {
			setIsLoading(false);
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

	const handleSubmitSearch = async (e) => {
		e.preventDefault();

		if (search.trim() === "") {
			return;
		}
		if (search.trim().length < 3) {
			addToast("Digite pelo menos 3 letras para buscar", "info");
			return;
		}

		try {
			setIsLoading(true);
			const data = await fetchTrainingSession(token, 1, 6, search);
			setTrainingSessions(data);
			setPage(1);
			setSearch("");
			setHasSearched(true);
		} catch (error) {
			addToast(error.message || "Erro ao buscar sessões de treinos", "error");
		} finally {
			setIsLoading(false);
		}
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
			{isLoading && <LoadingScreen />}

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

					{(data.length !== 0 || hasSearched) && (
						<form
							onSubmit={handleSubmitSearch}
							className="flex flex-col gap-2 mb-5">
							<label
								className="text-black dark:text-white"
								htmlFor="searchExercise">
								Pesquise sessões de um treino específico:
							</label>
							<div className="flex flex-row gap-2">
								<input
									id="searchExercise"
									type="text"
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									placeholder="Digite o título do treino"
									className="p-2 w-100 rounded border border-gray-600 dark:border-gray-600 dark:bg-gray-800 bg-gray-400 dark:text-white"
								/>
								<Buttons
									title="Buscar sessões do treino"
									type={"primary"}
									text={"Buscar"}
									submit={"submit"}
									width="w-30"
								/>
								{hasSearched && (
									<Buttons
										title="Ver todas as sessões"
										type="secondary"
										text="Ver todos"
										onClick={() => {
											loadSessions(1);
											setHasSearched(false);
										}}
										width="w-30"
									/>
								)}
							</div>
						</form>
					)}

					<Table
						headers={headers}
						data={data}
						renderActions={(row) => (
							<div className="flex gap-2">
								{row.situation === "Em andamento" && (
									<Buttons
										title="Finalizar sessão de treino"
										type={"success"}
										text={"Finalizar"}
										onClick={() => handleOpenFinish(row.id_training_session)}
									/>
								)}
								<Buttons
									title="Ver detalhes da sessão de treino"
									type={"info"}
									text={"Detalhes"}
									onClick={() => handleOpenDetails(row.id_training_session)}
								/>
								<Buttons
									title="Excluir sessão de treino"
									type={"warning"}
									text={"Excluir"}
									onClick={() => handleOpenDelete(row.id_training_session)}
								/>
							</div>
						)}
					/>
					{data.length > 0 && trainingSessions.pagination && (
						<div className="flex flex-row mt-5 gap-4 items-center justify-end">
							<Buttons
								title="Página anterior"
								type={"primary"}
								text={"Anterior"}
								onClick={() => {
									const prevPage = Math.max(page - 1, 1);
									loadSessions(prevPage);
								}}
								disabled={trainingSessions.pagination?.page === 1}
								width="w-30"
								loadingText="Anterior"
								disabledWidth="w-30"
							/>

							<Buttons
								title="Página seguinte"
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
								disabledWidth="w-30"
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
