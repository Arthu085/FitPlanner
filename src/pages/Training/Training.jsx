import Buttons from "../../components/Buttons";
import Container from "../../components/Container";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import SideBar from "../../components/SideBar";
import Card from "../../components/Card";
import LoadingScreen from "../../components/LoadingScreen";
import DetailsIcon from "./DetailsIcon";
import DetailsModalTraining from "./DetailsModalTraining";
import DeleteModalTraining from "./DeleteModalTraining";
import CreateModalTraining from "./CreateModalTraining";
import EditModalTraining from "./EditModalTraining";

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { fetchTraining } from "../../api/trainingApi";
import { fetchAllExercises } from "../../api/exerciseApi";
import { useToast } from "../../hooks/useToast";

const Training = () => {
	const { user } = useAuth();
	const addToast = useToast();
	const token = user?.token;

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [training, setTraining] = useState([]);
	const [selectedTrainingId, setSelectedTrainingId] = useState(null);
	const [detailsModal, setDetailsModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [createModal, setCreateModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [exercises, setExercises] = useState([]);
	const [trainingToEdit, setTrainingToEdit] = useState(null);

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

	const loadExercises = async () => {
		try {
			setLoading(true);
			const data = await fetchAllExercises(token);
			setExercises(data);
		} catch (error) {
			addToast(error.message || "Erro ao buscar exercícios", "error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadTraining();
	}, [token]);

	const handleOpenDetails = (id) => {
		setSelectedTrainingId(id);
		setDetailsModal(true);
	};

	const handleOpenDelete = (id) => {
		setSelectedTrainingId(id);
		setDeleteModal(true);
	};

	const handleOpenCreate = () => {
		loadExercises();
		setCreateModal(true);
	};

	const handleOpenEdit = (id) => {
		loadExercises();

		const selected = training.find((t) => t.id === id);
		if (!selected) {
			addToast("Treino não encontrado", "error");
			return;
		}

		setSelectedTrainingId(id);
		setTrainingToEdit(selected);
		setEditModal(true);
	};

	return (
		<>
			{loading && <LoadingScreen />}

			<Container>
				<Header />
				<SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
				<Layout isSidebarOpen={isSidebarOpen} title="Treinos">
					<section className="space-y-2 mt-7 mb-5 flex flex-row justify-between items-center">
						<div>
							<p className="text-black dark:text-white">
								Essa é a sua tela de <strong>treinos</strong>.
							</p>
							<p className="text-black dark:text-white">
								Aqui você pode visualizar, criar, editar e excluir{" "}
								<strong>treinos</strong>.
							</p>
						</div>
						<div>
							<Buttons
								text={"Novo Treino"}
								type={"primary"}
								onClick={handleOpenCreate}
							/>
						</div>
					</section>

					<Card
						data={training}
						renderActions={(item) => (
							<div className="flex flex-row items-center justify-between w-full">
								<div>
									<DetailsIcon onClick={() => handleOpenDetails(item.id)} />
								</div>
								<div className="flex gap-3">
									<Buttons
										type={"primary"}
										text={`Editar`}
										width="w-24"
										onClick={() => handleOpenEdit(item.id)}
									/>
									<Buttons
										type={"warning"}
										text={`Excluir`}
										width="w-24"
										onClick={() => handleOpenDelete(item.id)}
									/>
								</div>
							</div>
						)}
					/>
					<DetailsModalTraining
						openDetailsModal={detailsModal}
						onClose={() => setDetailsModal(false)}
						id_training={selectedTrainingId}
					/>
					<DeleteModalTraining
						openDeleteModal={deleteModal}
						onClose={() => setDeleteModal(false)}
						id_training={selectedTrainingId}
						reloadTraining={loadTraining}
					/>
					<CreateModalTraining
						openCreateModal={createModal}
						onClose={() => setCreateModal(false)}
						reloadTraining={loadTraining}
						exercises={exercises}
					/>
					<EditModalTraining
						openEditModal={editModal}
						onClose={() => setEditModal(false)}
						reloadTraining={loadTraining}
						exercises={exercises}
						id_training={selectedTrainingId}
						trainingData={trainingToEdit}
					/>
				</Layout>
				<Footer />
			</Container>
		</>
	);
};

export default Training;
