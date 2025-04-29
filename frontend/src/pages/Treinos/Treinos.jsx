import "./Treinos.css";

import { v4 as uuidv4 } from "uuid";

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
	deleteExercicioOnEditing,
	addExercicioOnEditing,
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
	const [treinoSelecionado, setTreinoSelecionado] = useState({
		id_treino: "",
		nome_treino: "",
		exercicios: [],
	});
	const [treinoOriginal, setTreinoOriginal] = useState({
		id_treino: "",
		nome_treino: "",
		exercicios: [],
	});

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
		setExercicioSelecionado([{ id_exercise: "", serie: "", repeticoes: "" }]);
	};

	const toggleFormEditVisible = (treino) => {
		setFormVisibleEdit(!formVisibleEdit);

		const treinoFormatado = {
			id_treino: treino.id_treino,
			nome_treino: treino.nome_treino,
			exercicios: Array.isArray(treino.exercicios)
				? treino.exercicios.map((exercicio) => ({
						id_treino_exercicio: exercicio.id_treino_exercicio,
						id_exercise: exercicio.id_exercise,
						serie: exercicio.serie,
						repeticoes: exercicio.repeticoes,
				  }))
				: [],
		};

		setTreinoSelecionado(treinoFormatado);
		setTreinoOriginal(treinoFormatado);
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
		setTreinoSelecionado((prev) => ({
			...prev,
			exercicios: [
				...prev.exercicios,
				{
					id_exercise: "",
					serie: "",
					repeticoes: "",
					isNew: true,
					tempId: uuidv4(),
				},
			],
		}));
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

	const handleDeleteExercicio = async (index, exercicio) => {
		try {
			// Se não tem id_treino_exercicio, é um novo exercício não salvo ainda
			if (!exercicio.id_treino_exercicio) {
				setTreinoSelecionado((prev) => ({
					...prev,
					exercicios: prev.exercicios.filter((_, i) => i !== index),
				}));
				return;
			}

			// Se tiver, chamar a API para deletar do banco
			const result = await deleteExercicioOnEditing(
				exercicio.id_treino_exercicio
			);

			if (!result.success) {
				showErrorToast(result.message);
				return;
			}

			// Remove do estado se deletou com sucesso
			setTreinoSelecionado((prev) => ({
				...prev,
				exercicios: prev.exercicios.filter((_, i) => i !== index),
			}));

			await loadTreinos();
			showSuccessToast("Exercício removido com sucesso");
		} catch (error) {
			showErrorToast("Erro ao deletar exercício");
		}
	};

	const handleEditTreino = async (e) => {
		e.preventDefault();

		// Verifica se algo foi alterado ANTES de prosseguir
		const nomeAlterado =
			treinoSelecionado.nome_treino.trim() !==
			treinoOriginal.nome_treino.trim();

		// Verifica se há exercício novo e se o id do exercício novo já existe
		const houveNovoExercicio = treinoSelecionado.exercicios.some((ex) => {
			if (ex.isNew) {
				// Verifica se o id_exercise do exercício novo já existe no treino
				const idsDosExerciciosNoTreino = treinoSelecionado.exercicios.map(
					(ex) => ex.id_exercise
				);

				// Se o id_exercise já estiver no treino, mostra erro e retorna true
				if (idsDosExerciciosNoTreino.includes(ex.id_exercise)) {
					showInfoToast("O exercício já está no treino");
					houveErro = true; // Marca que houve erro
					return true; // Impede o exercício de ser considerado como novo
				}
			}
			return false;
		});

		const houveExercicioEditado = treinoSelecionado.exercicios.some(
			(exSelecionado) => {
				if (exSelecionado.isNew) return false;

				const original = treinoOriginal.exercicios.find(
					(e) => e.id_treino_exercicio === exSelecionado.id_treino_exercicio
				);

				if (!original) return false;

				return (
					parseInt(exSelecionado.id_exercise) !==
						parseInt(original.id_exercise) ||
					parseInt(exSelecionado.serie) !== parseInt(original.serie) ||
					parseInt(exSelecionado.repeticoes) !== parseInt(original.repeticoes)
				);
			}
		);

		// Verifica se não houve alterações
		if (!nomeAlterado && !houveNovoExercicio && !houveExercicioEditado) {
			showInfoToast("Nenhuma alteração detectada");
			return;
		}

		let houveErro = false;
		setLoading(true);

		// Atualiza o nome do treino, se necessário
		if (nomeAlterado) {
			try {
				const resultNome = await editTreino({
					id_treino: treinoSelecionado.id_treino,
					nome_treino: treinoSelecionado.nome_treino,
				});

				if (!resultNome.success) {
					showErrorToast(resultNome.message);
					houveErro = true;
				}
			} catch (error) {
				showErrorToast("Erro ao atualizar nome do treino");
				houveErro = true;
			}
		}

		// Verifica duplicação de exercício durante a inserção de novos exercícios
		const idsDosExerciciosNoTreino = treinoSelecionado.exercicios.map(
			(ex) => ex.id_exercise
		);

		// Verifica e processa os exercícios (atualização ou inserção)
		for (const exSelecionado of treinoSelecionado.exercicios) {
			// Se for novo, verifica duplicação antes de adicionar
			if (exSelecionado.isNew) {
				if (idsDosExerciciosNoTreino.includes(exSelecionado.id_exercise)) {
					showErrorToast("O exercício já está no treino.");
					houveErro = true;
					break;
				}

				try {
					const resultAdd = await addExercicioOnEditing({
						id_treino: treinoSelecionado.id_treino,
						id_exercise: exSelecionado.id_exercise,
						serie: exSelecionado.serie,
						repeticoes: exSelecionado.repeticoes,
					});

					if (!resultAdd.success) {
						showErrorToast(resultAdd.message);
						houveErro = true;
						continue;
					}
				} catch (error) {
					showErrorToast("Erro ao adicionar novo exercício");
					houveErro = true;
					continue;
				}
			} else {
				// Se não é novo, verifica alterações
				const original = treinoOriginal.exercicios.find(
					(e) => e.id_treino_exercicio === exSelecionado.id_treino_exercicio
				);

				if (!original) continue;

				const exercicioAlterado =
					parseInt(exSelecionado.id_exercise) !==
						parseInt(original.id_exercise) ||
					parseInt(exSelecionado.serie) !== parseInt(original.serie) ||
					parseInt(exSelecionado.repeticoes) !== parseInt(original.repeticoes);

				if (exercicioAlterado) {
					try {
						const resultEdit = await editTreino({
							id_treino: treinoSelecionado.id_treino,
							id_treino_exercicio: exSelecionado.id_treino_exercicio,
							id_exercise: exSelecionado.id_exercise,
							serie: exSelecionado.serie,
							repeticoes: exSelecionado.repeticoes,
						});

						if (
							resultEdit.message ===
							"Este exercício já está associado a este treino"
						) {
							showInfoToast(resultEdit.message);
							houveErro = true;
							break;
						}

						if (!resultEdit.success) {
							showErrorToast(resultEdit.message);
							houveErro = true;
							break;
						}
					} catch (error) {
						showErrorToast("Erro ao atualizar exercício");
						houveErro = true;
						break;
					}
				}
			}
		}

		setLoading(false);
		await loadTreinos();

		if (!houveErro) {
			showSuccessToast("Treino atualizado com sucesso");
			setFormVisibleEdit(false);
		} else {
			showErrorToast("Algumas alterações não foram salvas");
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
							{treinoSelecionado.exercicios.map((exercicio, index) => (
								<div
									key={
										exercicio.id_treino_exercicio || exercicio.tempId || index
									}
									className="select-btn-remove">
									<div className="form-group">
										<label>Exercício {index + 1}</label>
										<select
											value={exercicio.id_exercise}
											onChange={(e) => {
												const novosExercicios =
													treinoSelecionado.exercicios.map((ex, i) =>
														i === index
															? { ...ex, id_exercise: e.target.value }
															: ex
													);
												setTreinoSelecionado((prev) => ({
													...prev,
													exercicios: novosExercicios,
												}));
											}}>
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
												id="serie"
												value={exercicio.serie}
												onChange={(e) => {
													const valor = parseInt(e.target.value, 10);
													const novosExercicios =
														treinoSelecionado.exercicios.map((ex, i) =>
															i === index
																? { ...ex, serie: isNaN(valor) ? "" : valor }
																: ex
														);
													setTreinoSelecionado((prev) => ({
														...prev,
														exercicios: novosExercicios,
													}));
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
													const valor = parseInt(e.target.value, 10);
													const novosExercicios =
														treinoSelecionado.exercicios.map((ex, i) =>
															i === index
																? {
																		...ex,
																		repeticoes: isNaN(valor) ? "" : valor,
																  }
																: ex
														);
													setTreinoSelecionado((prev) => ({
														...prev,
														exercicios: novosExercicios,
													}));
												}}
												min="1"
												step="1"
												required
											/>
										</div>
									</div>
									{treinoSelecionado.exercicios.length > 1 && (
										<button
											type="button"
											onClick={() => handleDeleteExercicio(index, exercicio)}
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
