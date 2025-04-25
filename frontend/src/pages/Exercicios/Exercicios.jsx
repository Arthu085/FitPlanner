import "./Exercicios.css";

// react
import React, { useEffect, useState } from "react";

// components
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SideBar from "../../components/SideBar/SideBar";
import InfoToast from "../../components/InfoToast/InfoToast";
import ErrorToast from "../../components/ErrorToast/ErrorToast";
import SuccessToast from "../../components/SuccessToast/SuccessToast";
import Loading from "../../components/Loading/Loading";
import Pagination from "../../components/Pagination/Pagination";

// hooks
import { useAuth } from "../../hooks/useAuth";
import {
	fetchExercicios,
	createExercicio,
	deleteExercicio,
	editExercicio,
} from "../../hooks/api/exerciciosApi";
import { useToast } from "../../hooks/useToast";

const Exercicios = () => {
	const [formVisibleAdd, setFormVisibleAdd] = useState(false);
	const [formVisibleEdit, setFormVisibleEdit] = useState(false);
	const [formVisibleDelete, setFormVisibleDelete] = useState(false);
	const [exercicios, setExercicios] = useState([]);
	const [exercise_name, setExerciseName] = useState("");
	const [id_exercise, setExercicioId] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const {
		errorMessage,
		showError,
		successMessage,
		showSuccess,
		infoMessage,
		showInfo,
		showErrorToast,
		showSuccessToast,
		showInfoToast,
		hideToasts,
	} = useToast();
	const [loading, setLoading] = useState(false);

	const { isLoggedIn } = useAuth();

	useEffect(() => {
		isLoggedIn();
	}, []);

	useEffect(() => {
		loadExercicios();
	}, [currentPage]);

	const toggleFormAdd = () => {
		setFormVisibleAdd(!formVisibleAdd);
	};

	const toggleFormEdit = (id_exercise) => {
		setFormVisibleEdit(!formVisibleEdit);
		setExercicioId(id_exercise);
	};

	const toggleFormDelete = (id_exercise) => {
		setFormVisibleDelete(!formVisibleDelete);
		setExercicioId(id_exercise);
	};

	const loadExercicios = async () => {
		setLoading(true);
		const result = await fetchExercicios(currentPage);

		if (!result.success) {
			showErrorToast(result.message);
			setLoading(false);
			return;
		}

		if (result.success && result.data.length === 0) {
			showInfoToast(result.message);
			setLoading(false);
			setExercicios(result.data);
			return;
		}

		setLoading(false);
		setExercicios(result.data);
		setTotalPages(result.totalPages);
	};

	const nextPage = () => {
		if (currentPage < totalPages) setCurrentPage(currentPage + 1);
	};

	const prevPage = () => {
		if (currentPage > 1) setCurrentPage(currentPage - 1);
	};

	const handleCreateExercicio = async (e) => {
		e.preventDefault();

		const exercicioData = { exercise_name };

		setLoading(true);
		const result = await createExercicio(exercicioData);

		if (result.message === "Esse exercício já existe") {
			showInfoToast(result.message);
			setLoading(false);
			return;
		}

		if (!result.success) {
			showErrorToast(result.message);
			setLoading(false);
			return;
		}

		await loadExercicios();
		setLoading(false);
		setExerciseName("");
		showSuccessToast(result.message);
		toggleFormAdd();
	};

	const handleDeleteExercicio = async (e) => {
		e.preventDefault();

		setLoading(true);
		const result = await deleteExercicio(id_exercise);

		if (!result.success) {
			showErrorToast(result.message);
			setLoading(false);
			return;
		}

		await loadExercicios();
		setLoading(false);
		showSuccessToast(result.message);
		setFormVisibleDelete(!formVisibleDelete);
	};

	const handleEditExercicio = async (e) => {
		e.preventDefault();

		const exercicioData = { id_exercise, exercise_name };

		setLoading(true);
		const result = await editExercicio(exercicioData);

		if (result.message === "Esse exercício já existe") {
			showInfoToast(result.message);
			setLoading(false);
			return;
		}

		if (!result.success) {
			showErrorToast(result.message);
			setLoading(false);
			return;
		}

		await loadExercicios();
		setLoading(false);
		showSuccessToast(result.message);
		setFormVisibleEdit(!formVisibleEdit);
		setExerciseName("");
	};

	return (
		<div className="sidebar-pages-container">
			<NavigationBar />
			<SideBar />
			{loading && <Loading />}
			<div className="toast-container">
				<ErrorToast
					message={errorMessage}
					show={showError}
					onClose={hideToasts}
				/>
				<SuccessToast
					message={successMessage}
					show={showSuccess}
					onClose={hideToasts}
				/>
				<InfoToast message={infoMessage} show={showInfo} onClose={hideToasts} />
			</div>
			<div className="container-page">
				<h1 className="tittle">Exercícios</h1>
				<div className="container-subtitle-btns">
					<h2>Lista de Exercícios:</h2>
					<button className="add-btn" onClick={toggleFormAdd}>
						Adicionar Exercício
					</button>
				</div>
				<div className="list-btns">
					<ul>
						{exercicios.length > 0 ? (
							exercicios.map((exercicio) => (
								<li key={exercicio.id_exercise}>
									<span>{exercicio.exercise_name}</span>
									<div className="edit-delete-btns">
										<button
											onClick={() => toggleFormEdit(exercicio.id_exercise)}>
											Editar
										</button>
										<button
											onClick={() => toggleFormDelete(exercicio.id_exercise)}>
											Excluir
										</button>
									</div>
								</li>
							))
						) : (
							<p>Nenhum exercício cadastrado.</p>
						)}
					</ul>
				</div>
				{totalPages > 1 && (
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPrev={prevPage}
						onNext={nextPage}
					/>
				)}
			</div>

			{formVisibleAdd && (
				<div className="form-container">
					<div className="form-overlay" onClick={toggleFormAdd}></div>
					<div className="form-content">
						<h2>Adicionar Exercício</h2>
						<form className="form-add" onSubmit={handleCreateExercicio}>
							<label>Nome do Exercício</label>
							<input
								type="text"
								placeholder="Digite o nome do exercício"
								value={exercise_name}
								onChange={(e) => setExerciseName(e.target.value)}
								required
							/>
							<button type="submit" className="add-btn">
								Adicionar
							</button>
						</form>
					</div>
				</div>
			)}

			{formVisibleEdit && (
				<div className="form-container">
					<div className="form-overlay" onClick={toggleFormEdit}></div>
					<div className="form-content">
						<h2>Editar Exercício</h2>
						<form className="form-add" onSubmit={handleEditExercicio}>
							<label>Novo nome do Exercício</label>
							<input
								type="text"
								placeholder="Digite o novo nome do exercício"
								required
								value={exercise_name}
								onChange={(e) => setExerciseName(e.target.value)}
							/>
							<button type="submit" className="add-btn">
								Salvar
							</button>
						</form>
					</div>
				</div>
			)}

			{formVisibleDelete && (
				<div className="form-container">
					<div
						className="form-overlay"
						onClick={() => toggleFormDelete()}></div>
					<div className="form-content">
						<h2>Excluir Exercício</h2>
						<form className="form-delete-exercicio">
							<label>Deseja excluir o exercício?</label>
							<div className="delete-btns">
								<button onClick={handleDeleteExercicio}>SIM</button>
								<button onClick={() => toggleFormDelete()}>NÃO</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default Exercicios;
