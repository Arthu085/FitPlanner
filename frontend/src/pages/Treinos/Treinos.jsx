import React, { useEffect, useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SideBar from "../../components/SideBar/SideBar";
import { useNavigate } from "react-router-dom";
import "./Treinos.css";

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

	const userId = localStorage.getItem("id");
	const navigate = useNavigate();
	useEffect(() => {
		if (!userId) {
			alert("Faça login no sistema");
			localStorage.removeItem("id");
			navigate("/");
		}
	}, [userId, navigate]);

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

	const getTreinos = async () => {
		try {
			const result = await fetch(
				`http://localhost:3000/api/treinos/gettreinos/${userId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			const data = await result.json();

			if (result.ok) {
				const groupedTreinos = groupTreinosById(data);
				setTreinos(groupedTreinos);
			} else {
				alert(`Erro ao buscar treinos: ${data.message}`);
			}
		} catch (error) {
			console.error("Erro ao buscar treinos:", error);
			alert("Erro ao buscar treinos");
		}
	};

	useEffect(() => {
		getTreinos();
	}, []);

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

	const addTreino = async (event) => {
		event.preventDefault();

		try {
			const result = await fetch(
				"http://localhost:3000/api/treinos/addtreino",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						nome_treino: nomeTreino,
						exercicios: exercicioSelecionado,
						id_user: userId,
					}),
				}
			);

			const data = await result.json();

			if (result.status === 201) {
				alert(data.message); // Treino criado com sucesso
				setFormVisibleAdd(!formVisibleAdd);
			} else if (result.status === 400) {
				alert(`Erro: ${data.error}`); // Exibe o erro se o exercício já existir no treino
			}

			getTreinos(); // Atualiza a lista de treinos
		} catch (error) {
			console.error("Erro ao adicionar treino:", error);
			alert(
				"Ocorreu um erro ao adicionar o treino. Tente novamente mais tarde."
			);
		}
	};

	const getExercicios = async () => {
		try {
			const result = await fetch(
				"http://localhost:3000/api/exercicios/getexercicios"
			);
			const data = await result.json();

			if (result.ok) {
				setExercicios(data.data);
			} else {
				alert(`Erro ao buscar exercícios: ${data.message}`);
			}
		} catch (error) {
			console.error("Erro ao buscar exercícios:", error);
			alert("Erro ao buscar exercícios");
		}
	};

	useEffect(() => {
		getExercicios();
	}, []);

	const cancelDelete = () => {
		setFormVisibleDelete(false);
	};

	const deleteTreino = async (event) => {
		event.preventDefault();

		try {
			const result = await fetch(
				`http://localhost:3000/api/treinos/deletetreino/${idTreino}`,
				{
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
				}
			);
			const data = await result.json();

			if (result.ok) {
				alert(data.message);
				setFormVisibleDelete(false);
				getTreinos();
			} else {
				alert(`Erro ao excluir treino: ${data.message}`);
			}
		} catch (error) {
			console.error("Erro ao excluir treino:", error);
			alert("Erro ao excluir treino");
		}
	};

	const editTreino = async (e) => {
		e.preventDefault();

		try {
			const responseUpdateNome = await fetch(
				`http://localhost:3000/api/treinos/edittreino/${idTreino}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						nome_treino: treinoSelecionado.nome_treino,
					}),
				}
			);

			const responseUpdateData = await fetch(
				`http://localhost:3000/api/treinos/edittreino/${idTreino}/${idTreinoExercicio}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						nome_treino: treinoSelecionado.nome_treino,
						exercicios: exercicioSelecionado.map((exercicio) => ({
							id_treino_exercicio: exercicio.id_treino_exercicio,
							id_exercise: exercicio.id_exercise,
							serie: exercicio.serie,
							repeticoes: exercicio.repeticoes,
						})),
					}),
				}
			);

			const dataUpdateNome = await responseUpdateNome.json();
			const dataUpdateData = await responseUpdateData.json();

			if (responseUpdateData.ok) {
				alert("Treino atualizado com sucesso!");
				toggleFormEditVisible();
				l;
			} else {
				alert("Erro ao atualizar treino: " + data.error);
			}

			if (responseUpdateNome.ok) {
				alert("Nome do treino atualizado com sucesso!");
				toggleFormEditVisible();
			} else {
				alert("Erro ao atualizar treino: " + data.error);
			}
		} catch (error) {
			console.error("Erro ao atualizar treino:", error);
			alert("Erro ao conectar ao servidor");
		}
	};

	return (
		<div className="sidebar-pages-container">
			<NavigationBar />
			<SideBar />
			<div className="treinos-container">
				<h2>Lista de Treinos</h2>
				<div className="btn-add-treino">
					<button className="btn-add-agenda" onClick={toggleFormAddVisible}>
						Adicionar Treino
					</button>
				</div>
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

			{formVisibleAdd && (
				<div className="form-container">
					<div
						className="form-overlay"
						onClick={() => setFormVisibleAdd(false)}></div>
					<div className="form-content">
						<h2>Adicionar Treino</h2>
						<form className="form-add" onSubmit={addTreino}>
							<label htmlFor="treino">Nome do Treino</label>
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

			{formVisibleEdit && (
				<div className="form-container">
					<div className="form-overlay" onClick={toggleFormEditVisible}></div>
					<div className="form-content">
						<h2>Editar Treino</h2>
						<form className="form-add" onSubmit={editTreino}>
							<label htmlFor="name">Novo nome do Treino</label>
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
											<label htmlFor="serie">Série</label>
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
											<label htmlFor="repeticao">Repetição</label>
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
			)}

			{formVisibleDelete && (
				<div className="form-container">
					<div className="form-overlay" onClick={toggleFormDeleteVisible}></div>
					<div className="form-content">
						<h2>Excluir Treino</h2>
						<form className="form-delete-exercicio">
							<label htmlFor="name">Deseja excluir o treino?</label>
							<div className="delete-btns">
								<button onClick={deleteTreino}>SIM</button>
								<button onClick={cancelDelete}>NÃO</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default Treinos;
