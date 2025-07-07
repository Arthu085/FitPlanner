import Container from "../../components/Container";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import SideBar from "../../components/SideBar";
import Table from "../../components/Table";
import Buttons from "../../components/Buttons";
import LoadingScreen from "../../components/LoadingScreen";
import DeleteModalExercise from "./DeleteModalExercise";

import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { fetchAllExercises } from "../../api/exerciseApi";

const Exercise = () => {
	const { user } = useAuth();
	const token = user?.token;
	const addToast = useToast();

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [exercises, setExercises] = useState([]);
	const [pagination, setPagination] = useState(null);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [deleteModal, setDeleteModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [selectedExerciseId, setSelectedExerciseId] = useState(null);

	const headers = [
		{ label: "Name", key: "name" },
		{ label: "Descrição", key: "description" },
		{ label: "Grupo Muscular", key: "muscle_group" },
		{ label: "Usuário Criador", key: "user_name" },
	];

	const loadExercises = async (pageToLoad = 1) => {
		try {
			setLoading(true);
			const response = await fetchAllExercises(token, pageToLoad, 6);
			const transformed = response.data.map((exercise) => ({
				...exercise,
				muscle_group: exercise.muscle_group?.name || "Sem grupo",
				user_name: exercise.user?.name || "Desconhecido",
			}));

			setExercises(transformed);
			setPagination(response.pagination);
			setPage(pageToLoad);
		} catch (error) {
			addToast(error.message || "Erro ao buscar exercícios", "error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (token) {
			loadExercises(1);
		}
	}, [token]);

	const handleOpenDelete = (id) => {
		setSelectedExerciseId(id);
		setDeleteModal(true);
	};

	return (
		<>
			{loading && <LoadingScreen />}

			<Container>
				<Header />
				<SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
				<Layout isSidebarOpen={isSidebarOpen} title="Exercícios">
					<section className="space-y-2 mt-7 mb-5">
						<p className="text-black dark:text-white">
							Essa é a sua tela de <strong>exercícios</strong>.
						</p>
						<p className="text-black dark:text-white">
							Aqui você pode visualizar, adicionar, editar e excluir os seus{" "}
							<strong>exercícios</strong>.
						</p>
					</section>

					<Table
						headers={headers}
						data={exercises}
						renderActions={(row) => (
							<div className="flex gap-2">
								{row.user?.id !== user?.id ? (
									<p className="text-black dark:text-white">Sem permissão</p>
								) : (
									<>
										<Buttons type={"primary"} text={"Editar"} />
										<Buttons
											type={"warning"}
											text={"Excluir"}
											onClick={() => handleOpenDelete(row.id)}
										/>
									</>
								)}
							</div>
						)}
					/>
					{exercises.length > 0 && (
						<div className="flex flex-row mt-5 gap-4 items-center justify-end">
							<Buttons
								type="primary"
								text="Anterior"
								onClick={() => loadExercises(page - 1)}
								disabled={pagination?.page === 1}
								width="w-30"
								loadingText="Anterior"
							/>
							<Buttons
								type="primary"
								text="Próximo"
								onClick={() => loadExercises(page + 1)}
								disabled={pagination?.page === pagination?.totalPages}
								width="w-30"
								loadingText="Próximo"
							/>
						</div>
					)}
					<DeleteModalExercise
						openDeleteModal={deleteModal}
						onClose={() => setDeleteModal(false)}
						id_exercise={selectedExerciseId}
						reloadExercises={loadExercises}
					/>
				</Layout>
				<Footer />
			</Container>
		</>
	);
};

export default Exercise;
