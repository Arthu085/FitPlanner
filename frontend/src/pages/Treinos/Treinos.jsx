import "./Treinos.css";

// react
import React, { useEffect, useState } from "react";

// components
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SideBar from "../../components/SideBar/SideBar";

// hooks
import { useAuth } from "../../hooks/useAuth";
import {
	fetchTreinos,
	createTreino,
	deleteTreino,
} from "../../hooks/api/treinosApi";
import { fetchExercicios } from "../../hooks/api/exerciciosApi";

const Treinos = () => {
	const [formVisibleAdd, setFormVisibleAdd] = useState(false);
	const [formVisibleEdit, setFormVisibleEdit] = useState(false);
	const [formVisibleDelete, setFormVisibleDelete] = useState(false);
	const [treinos, setTreinos] = useState([]);
	const [nomeTreino, setNomeTreino] = useState("");
	const [exercicios, setExercicios] = useState([]);
	const [exercicioSelecionado, setExerciciosSelecionados] = useState([
		{ id_exercise: "", serie: "", repeticoes: "", exercise_name: "" },
	]);
	const [idTreino, setIdTreino] = useState(null);
	const [idTreinoExercicio, setIdTreinoExercicio] = useState([]);
	const [treinoSelecionado, setTreinoSelecionado] = useState({
		id_treino: "",
		nome_treino: "",
	});

	const { userId, isLoggedIn } = useAuth();

	useEffect(() => {
		isLoggedIn();
		loadExercicios();
	}, []);

	useEffect(() => {
		loadTreinos();
	}, [userId]);

	const toggleFormAddVisible = () => {
		setFormVisibleAdd(!formVisibleAdd);
		setNomeTreino("");
		setExerciciosSelecionados([{ id_exercise: "", serie: "", repeticoes: "" }]);
	};

	const toggleFormEditVisible = (id_treino, id_treino_exercicio) => {
		setFormVisibleEdit(!formVisibleEdit);
		setIdTreino(id_treino);

		// Encontrar o treino pelo id_treino
		const treino = treinos.find((t) => t.id_treino === id_treino);

		// Atualizar treinoSelecionado com os exercícios do treino
		setTreinoSelecionado(treino);

		// Atualizar os exercícios no estado
		if (treino && treino.exercicios) {
			setExerciciosSelecionados(
				treino.exercicios.map((exercicio) => ({
					id_exercise: exercicio.id_exercise,
					serie: exercicio.serie || "",
					repeticoes: exercicio.repeticoes || "",
					exercise_name: exercicio.exercise_name,
				}))
			);
		}
		setIdTreinoExercicio(id_treino_exercicio);
	};

	const toggleFormDeleteVisible = (id_treino) => {
		setFormVisibleDelete(!formVisibleDelete);
		setIdTreino(id_treino);
	};

	const adicionarExercicio = () => {
		setExerciciosSelecionados([
			...exercicioSelecionado,
			{ id_exercise: "", serie: "", repeticoes: "" },
		]);
	};

	const atualizarExercicio = (index, campo, valor) => {
		const novosExercicios = [...exercicioSelecionado];
		novosExercicios[index][campo] = valor;
		setExerciciosSelecionados(novosExercicios);
	};

	const removerExercicio = (index) => {
		const novosExercicios = exercicioSelecionado.filter((_, i) => i !== index);
		setExerciciosSelecionados(novosExercicios);
	};

	const loadTreinos = async () => {
		try {
			const data = await fetchTreinos(userId);
			const groupedTreinos = groupTreinosById(data);
			setTreinos(groupedTreinos);
		} catch (error) {
			console.error("Erro ao buscar treinos:", error);
			alert("Erro ao buscar treinos");
		}
	};

	const groupTreinosById = (treinos) => {
		const grouped = treinos.reduce((acc, treino) => {
			if (!acc[treino.id_treino]) {
				acc[treino.id_treino] = {
					...treino,
					exercicios: [treino], // Inicia a lista de exercícios com o primeiro treino
				};
			} else {
				acc[treino.id_treino].exercicios.push(treino); // Adiciona os exercícios à lista
			}
			return acc;
		}, {});

		return Object.values(grouped); // Retorna os treinos agrupados
	};

	const handleCreateTreino = async (e) => {
		e.preventDefault();

		const treinoData = {
			nome_treino: nomeTreino,
			exercicios: exercicioSelecionado,
			id_user: userId,
		};

		try {
			const data = await createTreino(treinoData);

			if (data.error === "O exercício já está cadastrado neste treino!") {
				alert(data.error);
				return;
			}

			alert(data.message);
			setFormVisibleAdd(!formVisibleAdd);
			loadTreinos();
		} catch (error) {
			console.error("Erro ao adicionar treino:", error);
			alert(
				"Ocorreu um erro ao adicionar o treino. Tente novamente mais tarde."
			);
		}
	};

	const loadExercicios = async () => {
		try {
			const data = await fetchExercicios();
			setExercicios(data.data);
		} catch (error) {
			console.error("Erro ao buscar exercícios:", error);
			alert("Erro ao buscar exercícios");
		}
	};

	const handleDeleteTreino = async (e) => {
		e.preventDefault();

		try {
			const data = await deleteTreino(idTreino);

			alert(data.message);
			setFormVisibleDelete(false);
			loadTreinos();
		} catch (error) {
			console.error("Erro ao excluir treino:", error);
			alert("Erro ao excluir treino");
		}
	};

	// const editTreino = async (e) => {
	// 	e.preventDefault();

	// 	try {
	// 		const responseUpdateNome = await fetch(
	// 			`http://localhost:3000/api/treinos/edittreino/${idTreino}`,
	// 			{
	// 				method: "PUT",
	// 				headers: {
	// 					"Content-Type": "application/json",
	// 				},
	// 				body: JSON.stringify({
	// 					nome_treino: treinoSelecionado.nome_treino,
	// 				}),
	// 			}
	// 		);

	// 		const responseUpdateData = await fetch(
	// 			`http://localhost:3000/api/treinos/edittreino/${idTreino}/${idTreinoExercicio}`,
	// 			{
	// 				method: "PUT",
	// 				headers: {
	// 					"Content-Type": "application/json",
	// 				},
	// 				body: JSON.stringify({
	// 					nome_treino: treinoSelecionado.nome_treino,
	// 					exercicios: exercicioSelecionado.map((exercicio) => ({
	// 						id_treino_exercicio: exercicio.id_treino_exercicio,
	// 						id_exercise: exercicio.id_exercise,
	// 						serie: exercicio.serie,
	// 						repeticoes: exercicio.repeticoes,
	// 					})),
	// 				}),
	// 			}
	// 		);

	// 		const dataUpdateNome = await responseUpdateNome.json();
	// 		const dataUpdateData = await responseUpdateData.json();

	// 		if (responseUpdateData.ok) {
	// 			alert("Treino atualizado com sucesso!");
	// 			toggleFormEditVisible();
	// 			l;
	// 		} else {
	// 			alert("Erro ao atualizar treino: " + data.error);
	// 		}

	// 		if (responseUpdateNome.ok) {
	// 			alert("Nome do treino atualizado com sucesso!");
	// 			toggleFormEditVisible();
	// 		} else {
	// 			alert("Erro ao atualizar treino: " + data.error);
	// 		}
	// 	} catch (error) {
	// 		console.error("Erro ao atualizar treino:", error);
	// 		alert("Erro ao conectar ao servidor");
	// 	}
	// };

	return (
		<div className="sidebar-pages-container">
			<NavigationBar />
			<SideBar />
			<div className="container-page">
				<h2 className="tittle-page">Lista de Treinos</h2>
				<div className="btn-add-treino">
					<button className="btn-add-agenda" onClick={toggleFormAddVisible}>
						Adicionar Treino
					</button>
				</div>

				<div className="metas-list">
					{treinos.length > 0 ? (
						treinos.map((treino) => (
							<div key={treino.id_treino} className="meta-content">
								<h2>{treino.nome_treino}</h2>
								{treino.exercicios.map((exercicio, index) => (
									<div key={index}>
										<span>{exercicio.exercise_name} -</span>
										<span> {exercicio.serie}x</span>
										<span>{exercicio.repeticoes}</span>
									</div>
								))}
								<div className="btn-edit-delete">
									<button
										className="btn-edit-treino"
										onClick={() =>
											toggleFormEditVisible(
												treino.id_treino,
												treino.id_treino_exercicio
											)
										}>
										Editar
									</button>
									<button
										className="btn-remove-treino"
										onClick={() => toggleFormDeleteVisible(treino.id_treino)}>
										Excluir
									</button>
								</div>
							</div>
						))
					) : (
						<p className="no-metas-message">Nenhum treino cadastrado.</p>
					)}
				</div>
			</div>

			{formVisibleAdd && (
				<div className="form-container">
					<div
						className="form-overlay"
						onClick={() => setFormVisibleAdd(false)}></div>
					<div className="form-content">
						<h2>Adicionar Treino</h2>
						<form className="form-add" onSubmit={handleCreateTreino}>
							<label>Nome do Treino</label>
							<input
								type="text"
								name="treino"
								placeholder="Digite o nome do treino"
								required
								value={nomeTreino}
								onChange={(e) => setNomeTreino(e.target.value)}
							/>
							{exercicioSelecionado.map((exercicio, index) => (
								<div key={index} className="select-btn-remove">
									<div className="form-group">
										<label>Exercício {index + 1}</label>
										<select
											className="select-exercicio"
											value={exercicio.id_exercise}
											onChange={(e) =>
												atualizarExercicio(index, "id_exercise", e.target.value)
											}
											required>
											<option value="">Selecione um exercício</option>
											{exercicios.map((ex) => (
												<option key={ex.id_exercise} value={ex.id_exercise}>
													{ex.exercise_name}
												</option>
											))}
										</select>
										<div className="serie-repeticao-container">
											<label>Série</label>
											<input
												type="number"
												placeholder="Digite a quantidade de séries"
												min="1"
												value={exercicio.serie}
												onChange={(e) =>
													atualizarExercicio(index, "serie", e.target.value)
												}
												required
											/>
											<label>Repetição</label>
											<input
												type="number"
												placeholder="Digite a quantidade de repetições"
												min="1"
												value={exercicio.repeticoes}
												onChange={(e) =>
													atualizarExercicio(
														index,
														"repeticoes",
														e.target.value
													)
												}
												required
											/>
										</div>
									</div>
									{exercicioSelecionado.length > 1 && (
										<button
											type="button"
											className="btn-remove"
											onClick={() => removerExercicio(index)}>
											Remover
										</button>
									)}
								</div>
							))}
							<button
								onClick={adicionarExercicio}
								type="button"
								className="add-btn-exercicio">
								Adicionar Exercício
							</button>
							<button type="submit" className="add-btn">
								Salvar Treino
							</button>
						</form>
					</div>
				</div>
			)}

			{/* {formVisibleEdit && (
				<div className="form-container">
					<div className="form-overlay" onClick={toggleFormEditVisible}></div>
					<div className="form-content">
						<h2>Editar Treino</h2>
						<form className="form-add" onSubmit={editTreino}>
							<label>Novo nome do Treino</label>
							<input
								type="text"
								placeholder="Digite o novo nome do treino"
								value={treinoSelecionado.nome_treino}
								onChange={(e) => {
									const novoTreino = { ...treinoSelecionado };
									novoTreino.nome_treino = e.target.value;
									setTreinoSelecionado(novoTreino);
								}}
								required
							/>
							{exercicioSelecionado.map((exercicio, index) => (
								<div key={exercicio.id_exercise} className="select-btn-remove">
									<div className="form-group">
										<label htmlFor={`exercicio-${exercicio.id_exercise}`}>
											Exercício {index + 1}
										</label>
										<select
											name={`exercicio-${exercicio.id_exercise}`}
											id={`exercicio-${exercicio.id_exercise}`}
											value={exercicio.id_exercise}
											onChange={(e) =>
												handleExercicioChange(index, e.target.value)
											}
											className="select-exercicio"
											required>
											<option value="">Selecione um exercício</option>
											<option
												key={exercicio.id_exercise}
												value={exercicio.id_exercise}>
												{exercicio.exercise_name}
											</option>
										</select>
										<div className="serie-repeticao-container">
											<label>Série</label>
											<input
												type="number"
												placeholder="Digite a quantidade de séries"
												id="serie"
												value={exercicio.serie}
												onChange={(e) => {
													const novosExercicios = [
														...exercicioSelecionado.exercicios,
													];
													novosExercicios[index].serie = e.target.value;
													setExerciciosSelecionados({
														...exercicioSelecionado,
														exercicios: novosExercicios,
													});
												}}
												min="1"
												step="1"
												required
											/>
											<label>Repetição</label>
											<input
												type="number"
												placeholder="Digite a quantidade de repetições"
												id="repeticao"
												value={exercicio.repeticoes}
												onChange={(e) => {
													const novosExercicios = [
														...exercicioSelecionado.exercicios,
													];
													novosExercicios[index].repeticoes = e.target.value;
													setExerciciosSelecionados({
														...exercicioSelecionado,
														exercicios: novosExercicios,
													});
												}}
												min="1"
												step="1"
												required
											/>
										</div>
									</div>
									{exercicioSelecionado.length > 1 && (
										<button
											type="button"
											onClick={() => removerExercicio(index)}
											className="btn-remove">
											Remover
										</button>
									)}
								</div>
							))}
							<button
								type="button"
								onClick={adicionarExercicio}
								className="add-btn-exercicio">
								Adicionar Exercício
							</button>
							<button type="submit" className="add-btn">
								Salvar
							</button>
						</form>
					</div>
				</div>
			)} */}

			{formVisibleDelete && (
				<div className="form-container">
					<div className="form-overlay" onClick={toggleFormDeleteVisible}></div>
					<div className="form-content">
						<h2>Excluir Treino</h2>
						<form className="form-delete-exercicio">
							<label>Deseja excluir o treino?</label>
							<div className="delete-btns">
								<button onClick={handleDeleteTreino}>SIM</button>
								<button
									onClick={() => setFormVisibleDelete(!formVisibleDelete)}>
									NÃO
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default Treinos;
