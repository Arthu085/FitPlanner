import Container from "../../components/Container";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import SideBar from "../../components/SideBar";
import Table from "../../components/Table";
import Buttons from "../../components/Buttons";
import LoadingScreen from "../../components/LoadingScreen";
import DeleteModalExercise from "./DeleteModalExercise";
import CreateModalExercise from "./CreateModalExercise";
import EditModalExercise from "./EditModalExercise";

import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { fetchAllExercises } from "../../api/exerciseApi";
import { fetchAllMuscleGroups } from "../../api/muscleGroupApi";

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
	const [createModal, setCreateModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [selectedExerciseId, setSelectedExerciseId] = useState(null);
	const [muscleGroups, setMuscleGroups] = useState([]);
	const [exerciseToEdit, setExerciseToEdit] = useState(null);
	const [search, setSearch] = useState("");
	const [hasSearched, setHasSearched] = useState(false);

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

	const loadMuscleGroups = async () => {
		try {
			setLoading(true);
			const response = await fetchAllMuscleGroups(token);
			setMuscleGroups(response.data);
		} catch (error) {
			addToast(error.message || "Erro ao buscar grupos musculares", "error");
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

	const handleOpenCreate = () => {
		loadMuscleGroups();
		setCreateModal(true);
	};

	const handleOpenEdit = (id) => {
		loadMuscleGroups();

		const selected = exercises.find((t) => t.id === id);
		if (!selected) {
			addToast("Exercício não encontrado", "error");
			return;
		}

		setSelectedExerciseId(id);
		setExerciseToEdit(selected);
		setEditModal(true);
	};

	const handleSubmitSearch = async (e, pageToLoad = 1) => {
		e.preventDefault();

		if (search.trim() === "") {
			return;
		}
		if (search.trim().length < 3) {
			addToast("Digite pelo menos 3 letras para buscar", "info");
			return;
		}

		try {
			setLoading(true);
			const response = await fetchAllExercises(token, pageToLoad, 6, search);
			const transformed = response.data.map((exercise) => ({
				...exercise,
				muscle_group: exercise.muscle_group?.name || "Sem grupo",
				user_name: exercise.user?.name || "Desconhecido",
			}));

			setExercises(transformed);
			setPagination(response.pagination);
			setPage(pageToLoad);
			setSearch("");
			setHasSearched(true);
		} catch (error) {
			addToast(error.message || "Erro ao buscar exercício", "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{loading && <LoadingScreen />}

			<Container>
				<Header />
				<SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
				<Layout isSidebarOpen={isSidebarOpen} title="Exercícios">
					<section className="space-y-2 mt-7 mb-5 flex flex-row justify-between items-center">
						<div>
							<p className="text-black dark:text-white">
								Essa é a sua tela de <strong>exercícios</strong>.
							</p>
							<p className="text-black dark:text-white">
								Aqui você pode visualizar, adicionar, editar e excluir os seus{" "}
								<strong>exercícios</strong>.
							</p>
						</div>
						<div>
							<Buttons
								text={"Novo Exercício"}
								type={"primary"}
								onClick={handleOpenCreate}
							/>
						</div>
					</section>

					{(exercises.length !== 0 || hasSearched) && (
						<form
							onSubmit={handleSubmitSearch}
							className="flex flex-col gap-2 mb-5">
							<label
								className="text-black dark:text-white"
								htmlFor="searchExercise">
								Pesquise um exercício específico:
							</label>
							<div className="flex flex-row gap-2">
								<input
									id="searchExercise"
									type="text"
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									placeholder="Digite o nome do exercício"
									className="p-2 w-100 rounded border border-gray-600 dark:border-gray-600 dark:bg-gray-800 bg-gray-400 dark:text-white"
								/>
								<Buttons
									type={"primary"}
									text={"Buscar"}
									submit={"submit"}
									width="w-30"
								/>
								{hasSearched && (
									<Buttons
										type="secondary"
										text="Ver todos"
										onClick={() => {
											loadExercises(1);
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
						data={exercises}
						renderActions={(row) => (
							<div className="flex gap-2">
								{row.user?.id !== user?.id ? (
									<p className="text-black dark:text-white">Sem permissão</p>
								) : (
									<>
										<Buttons
											type={"primary"}
											text={"Editar"}
											onClick={() => handleOpenEdit(row.id)}
										/>
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
					{exercises.length > 0 && pagination && (
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
					<CreateModalExercise
						openCreateModal={createModal}
						onClose={() => setCreateModal(false)}
						reloadExercise={loadExercises}
						muscleGroups={muscleGroups}
					/>
					<EditModalExercise
						openEditModal={editModal}
						onClose={() => setEditModal(false)}
						reloadExercise={loadExercises}
						muscleGroups={muscleGroups}
						exerciseData={exerciseToEdit}
						id_exercise={selectedExerciseId}
					/>
				</Layout>
				<Footer />
			</Container>
		</>
	);
};

export default Exercise;
