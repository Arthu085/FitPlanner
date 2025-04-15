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

	const deleteExercicio = async (event) => {
		event.preventDefault();

		try {
			const result = await fetch(
				`http://localhost:3000/api/exercicios/deleteexercicio/${id_exercise}`,
				{
					method: "DELETE",
				}
			);
			const data = await result.json();

			if (result.ok) {
				alert(data.message);
				getExercicios();
			} else {
				alert(`Erro: ${data.error}`);
			}
		} catch (err) {
			console.error("Erro ao deleter exercício", err);
			alert("Erro ao deletar exercício");
		}
		setFormVisibleDelete(!formVisibleDelete);
	};

	const editExercicio = async (event) => {
		event.preventDefault();

		if (!exercise_name || exercise_name.trim() === "") {
			alert("O nome do exercício não pode estar vazio.");
			return;
		}

		try {
			const result = await fetch(
				`http://localhost:3000/api/exercicios/editexercicio/${id_exercise}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ exercise_name }),
				}
			);
			const data = await result.json();

			if (result.status === 400) {
				alert(data.error);
				setExerciseName("");
				return;
			}

			if (result.ok) {
				alert(data.message);
				getExercicios();
				setExerciseName("");
			} else {
				alert(`Erro: ${data.error}`);
			}
		} catch (err) {
			console.error("Erro ao editar exercício", err);
			alert("Erro ao editar exercício");
		}
		setFormVisibleEdit(!formVisibleEdit);
	};

	return (
		<div className="sidebar-pages-container">
			<NavigationBar />
			<SideBar />
			<div className="exercicios-list">
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
						<form className="form-add" onSubmit={editExercicio}>
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
					<div className="form-overlay" onClick={toggleFormDelete}></div>
					<div className="form-content">
						<h2>Excluir Exercício</h2>
						<form className="form-delete-exercicio">
							<label>Deseja excluir o exercício?</label>
							<div className="delete-btns">
								<button onClick={deleteExercicio}>SIM</button>
								<button onClick={toggleFormDelete}>NÃO</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default Exercicios;
