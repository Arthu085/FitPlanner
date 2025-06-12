import Buttons from "../../components/Buttons";
import Container from "../../components/Container";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import SideBar from "../../components/SideBar";
import Card from "../../components/Card";

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { fetchTraining } from "../../api/trainingApi";
import LoadingScreen from "../../components/LoadingScreen";
import DetailsIcon from "./DetailsIcon";
import DetailsModalTraining from "./DetailsModalTraining";
import DeleteModalTraining from "./DeleteModalTraining";
import CreateModalTraining from "./CreateModalTraining";

const Training = () => {
	const { user } = useAuth();
	const token = user?.token;

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [training, setTraining] = useState([]);
	const [selectedTrainingId, setSelectedTrainingId] = useState(null);
	const [detailsModal, setDetailsModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [createModal, setCreateModal] = useState(false);

	const loadTraining = async () => {
		try {
			setLoading(true);
			const data = await fetchTraining(token);
			setTraining(data);
		} catch (error) {
			console.error("Erro ao buscar treinos:", error);
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
								onClick={() => setCreateModal(true)}
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
									<Buttons type={"primary"} text={`Editar`} width="w-24" />
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
					/>
				</Layout>
				<Footer />
			</Container>
		</>
	);
};

export default Training;
