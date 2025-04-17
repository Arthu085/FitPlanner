import "./Exercicios.css";

// react
import React, { useEffect, useState } from "react";

// components
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SideBar from "../../components/SideBar/SideBar";

// hooks
import { useAuth } from "../../hooks/useAuth";
import {
	fetchExercicios,
	createExercicio,
	deleteExercicio,
	editExercicio,
} from "../../hooks/api/exerciciosApi";

const Exercicios = () => {
	const [formVisibleAdd, setFormVisibleAdd] = useState(false);
	const [formVisibleEdit, setFormVisibleEdit] = useState(false);
	const [formVisibleDelete, setFormVisibleDelete] = useState(false);
	const [exercicios, setExercicios] = useState([]);
	const [exercise_name, setExerciseName] = useState("");
	const [id_exercise, setExercicioId] = useState(null);

	const { isLoggedIn } = useAuth();

	useEffect(() => {
		isLoggedIn();
		loadExercicios();
	}, []);

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
		try {
			const data = await fetchExercicios();
			setExercicios(data.data);
		} catch (error) {
			alert("Erro ao buscar exercícios", error);
		}
	};

	const handleCreateExercicio = async (e) => {
		e.preventDefault();

		if (!exercise_name || exercise_name.trim() === "") {
			alert("O nome do exercício não pode estar vazio.");
			return;
		}

		const exercicioData = { exercise_name };

		try {
			const data = await createExercicio(exercicioData);

			if (data && !data.error) {
				await loadExercicios();
				setExerciseName("");
				alert(data.message);
				toggleFormAdd();
			} else {
				alert(data.message || "Erro desconhecido");
			}
		} catch (error) {
			alert("Erro ao adicionar exercício");
			console.error("Erro ao adicionar exercício:", error);
		}
	};

	const handleDeleteExercicio = async (e) => {
		e.preventDefault();

		try {
			const data = await deleteExercicio(id_exercise);

			if (data && !data.error) {
				await loadExercicios();
				alert(data.message);
				setFormVisibleDelete(!formVisibleDelete);
			} else {
				alert(data.message || "Erro desconhecido");
			}
		} catch (error) {
			alert("Erro ao deletar exercício");
			console.error("Erro ao deletar exercício:", error);
		}
	};

	const handleEditExercicio = async (e) => {
		e.preventDefault();

		if (!exercise_name || exercise_name.trim() === "") {
			alert("O nome do exercício não pode estar vazio.");
			return;
		}

		const exercicioData = { id_exercise, exercise_name };

		try {
			const data = await editExercicio(exercicioData);

			if (data && !data.error) {
				await loadExercicios();
				alert(data.message);
				setFormVisibleEdit(!formVisibleEdit);
				setExerciseName("");
			} else {
				alert(data.message || "Erro desconhecido");
				setExerciseName("");
			}
		} catch (error) {
			alert("Erro ao editar exercício");
			console.error("Erro ao editar exercício:", error);
		}
	};

	return (
		<div className="sidebar-pages-container">
			<NavigationBar />
			<SideBar />
			<div className="container-page">
				<div className="h2-addbutton">
					<h2>Lista de Exercícios</h2>
					<button className="add-exercise-btn" onClick={toggleFormAdd}>
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
