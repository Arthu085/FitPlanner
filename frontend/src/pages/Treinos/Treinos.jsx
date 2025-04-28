import "./Treinos.css";

// react
import React, { useEffect, useState } from "react";

// components
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SideBar from "../../components/SideBar/SideBar";
import ErrorToast from "../../components/ErrorToast/ErrorToast";
import SuccessToast from "../../components/SuccessToast/SuccessToast";
import InfoToast from "../../components/InfoToast/InfoToast";
import Loading from "../../components/Loading/Loading";

// hooks
import { useAuth } from "../../hooks/useAuth";
import {
	fetchTreinos,
	createTreino,
	deleteTreino,
	editTreino,
} from "../../hooks/api/treinosApi";
import { fetchExerciciosNoLimit } from "../../hooks/api/exerciciosApi";
import { useToast } from "../../hooks/useToast";

const Treinos = () => {
	const [formVisibleAdd, setFormVisibleAdd] = useState(false);
	const [formVisibleEdit, setFormVisibleEdit] = useState(false);
	const [formVisibleDelete, setFormVisibleDelete] = useState(false);
	const [treinos, setTreinos] = useState([]);
	const [exercicios, setExercicios] = useState([]);
	const [idTreinoDelete, setIdTreinoDelete] = useState(null);
	const [exercicioSelecionado, setExercicioSelecionado] = useState([
		{ id_exercise: "", serie: "", repeticoes: "" },
	]);
	const [nomeTreino, setNomeTreino] = useState("");

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
	};

	const toggleFormEditVisible = (treino) => {
		setFormVisibleEdit(!formVisibleEdit);
		setTreinoSelecionado({
			id_treino: treino.id_treino,
			nome_treino: treino.nome_treino,
		});
		setTreinoExercicioSelecionado(treino.exercicios || []); // <- se vier os exercicios junto
	};

	const toggleFormDeleteVisible = (treino) => {
		setFormVisibleDelete(!formVisibleDelete);
		setIdTreinoDelete(treino);
	};

	const adicionarExercicio = () => {
		setExercicioSelecionado((prev) => [
			...prev,
			{ id_exercise: "", serie: "", repeticoes: "" },
		]);
	};

	const removerExercicio = (index) => {
		setExercicioSelecionado((prevState) =>
			prevState.filter((_, i) => i !== index)
		);
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

	const loadTreinos = async () => {
		setLoading(true);
		const result = await fetchTreinos(userId);

		if (!result.success) {
			showErrorToast(result.message);
			setLoading(false);
			return;
		}

		if (result.success && result.data.length === 0) {
			showInfoToast(result.message);
			setLoading(false);
			const groupedTreinos = groupTreinosById(result.data);
			setTreinos(groupedTreinos);
			return;
		}

		setLoading(false);
		const groupedTreinos = groupTreinosById(result.data);
		setTreinos(groupedTreinos);
	};

	const handleCreateTreino = async (e) => {
		e.preventDefault();

		const treinoData = {
			nome_treino: nomeTreino,
			exercicios: exercicioSelecionado,
			id_user: userId,
		};

		setLoading(true);
		const result = await createTreino(treinoData);

		if (result.message === "O exercício já está cadastrado neste treino") {
			showInfoToast(result.message);
			setLoading(false);
			return;
		}

		if (!result.success) {
			showErrorToast(result.message);
			setLoading(false);
			return;
		}

		await loadTreinos();
		setLoading(false);
		showSuccessToast(result.message);
		setFormVisibleAdd(!formVisibleAdd);
	};

	const loadExercicios = async () => {
		const result = await fetchExerciciosNoLimit();

		if (!result.success) {
			showErrorToast(result.message);
			return;
		}

		if (result.data.length === 0) {
			showInfoToast(result.message);
			return;
		}

		setExercicios(result.data);
	};

	const handleDeleteTreino = async (e) => {
		e.preventDefault();

		setLoading(true);
		const result = await deleteTreino(idTreinoDelete.id_treino);

		if (!result.success) {
			showErrorToast(result.message);
			setLoading(false);
			return;
		}

		await loadTreinos();
		setLoading(false);
		showSuccessToast(result.message);
		setFormVisibleDelete(false);
	};

	const handleEditTreino = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Atualizar o nome do treino
			const responseNome = await editTreino({
				idTreino: treinoSelecionado.id_treino,
				nomeTreino: treinoSelecionado.nome_treino,
			});

			// Atualizar cada exercício
			for (const exercicio of treinoExercicioSelecionado) {
				const responseExercicio = await editTreino({
					idTreino: treinoSelecionado.id_treino,
					idTreinoExercicio: exercicio.id_treino_exercicio,
					idExercicio: exercicio.id_exercise,
					serie: exercicio.serie,
					repeticoes: exercicio.repeticoes,
				});

				if (!responseExercicio.success) {
					showErrorToast(responseExercicio.message);
					setLoading(false);
					return;
				}
			}

			// Depois de tudo
			if (!responseNome.success) {
				showErrorToast(responseNome.message);
			} else {
				await loadTreinos();
				showSuccessToast(responseNome.message);
				toggleFormEditVisible(); // Fechar modal
			}
		} catch (error) {
			showErrorToast(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="sidebar-pages-container">
			<NavigationBar />
			<SideBar />
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
			{loading && <Loading />}
			<div className="container-page">
				<h1 className="tittle">Treinos</h1>
				<div className="container-subtitle-btns">
					<h2 className="tittle-page">Lista de Treinos:</h2>
					<button className="add-btn" onClick={toggleFormAddVisible}>
						Adicionar Treino
					</button>
				</div>

				<div className="metas-list">
					{treinos.length > 0 ? (
						treinos.map((treino) => (
							<div key={treino.id_treino} className="meta-content">
								<div>
									<h2>{treino.nome_treino}</h2>
									<div className="container-list">
										{treino.exercicios.map((exercicio, index) => (
											<div key={index}>
												<span>{exercicio.exercise_name} -</span>
												<span> {exercicio.serie}x</span>
												<span>{exercicio.repeticoes}</span>
											</div>
										))}
									</div>
								</div>
								<div className="btn-edit-delete">
									<button
										className="btn-edit-treino"
										onClick={() => toggleFormEditVisible(treino)}>
										Editar
									</button>
									<button
										className="btn-remove-treino"
										onClick={() => toggleFormDeleteVisible(treino)}>
										Excluir
									</button>
								</div>
							</div>
						))
					) : (
						<p>Nenhum treino cadastrado.</p>
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
											onChange={(e) => {
												const novoExercicio = [...exercicioSelecionado];
												novoExercicio[index].id_exercise = e.target.value;
												setExercicioSelecionado(novoExercicio);
											}}
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
												onChange={(e) => {
													const novosExercicios = [...exercicioSelecionado];
													novosExercicios[index].serie = e.target.value;
													setExercicioSelecionado(novosExercicios);
												}}
												required
											/>
											<label>Repetição</label>
											<input
												type="number"
												placeholder="Digite a quantidade de repetições"
												min="1"
												value={exercicio.repeticoes}
												onChange={(e) => {
													const novosExercicios = [...exercicioSelecionado];
													novosExercicios[index].repeticoes = e.target.value;
													setExercicioSelecionado(novosExercicios);
												}}
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
								type="button"
								className="add-btn-exercicio"
								onClick={adicionarExercicio}>
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
						<form className="form-add" onSubmit={handleEditTreino}>
							<label>Novo nome do Treino</label>
							<input
								type="text"
								placeholder="Digite o novo nome do treino"
								value={treinoSelecionado.nome_treino}
								onChange={(e) => {
									setTreinoSelecionado((prev) => ({
										...prev,
										nome_treino: e.target.value,
									}));
								}}
								required
							/>
							{treinoExercicioSelecionado.map((treinoExercicio, index) => (
								<div
									key={treinoExercicio.id_treino_exercicio}
									className="select-btn-remove">
									<div className="form-group">
										<label>Exercício {index + 1}</label>
										<select
											value={treinoExercicio.id_exercise}
											onChange={(e) => {
												const novosExercicios = [...treinoExercicioSelecionado];
												novosExercicios[index].id_exercise = e.target.value;
												setTreinoExercicioSelecionado(novosExercicios);
											}}>
											<option value="">Selecione um exercício</option>
											{exercicios.map((exercicio) => (
												<option
													key={exercicio.id_exercise}
													value={exercicio.id_exercise}>
													{exercicio.exercise_name}
												</option>
											))}
										</select>

										<div className="serie-repeticao-container">
											<label>Série</label>
											<input
												type="number"
												placeholder="Digite a quantidade de séries"
												id="serie"
												value={treinoExercicio.serie}
												onChange={(e) => {
													const novosExercicios = [
														...treinoExercicioSelecionado,
													];
													novosExercicios[index].serie = e.target.value;
													setTreinoExercicioSelecionado(novosExercicios);
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
												value={treinoExercicio.repeticoes}
												onChange={(e) => {
													const novosExercicios = [
														...treinoExercicioSelecionado,
													];
													novosExercicios[index].repeticoes = e.target.value;
													setTreinoExercicioSelecionado(novosExercicios);
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
