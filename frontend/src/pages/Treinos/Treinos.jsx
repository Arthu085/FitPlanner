import React, { useEffect, useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SideBar from "../../components/SideBar/SideBar";
import { useNavigate } from "react-router-dom";
import "./Treinos.css";

const Treinos = () => {
	const [formVisibleAdd, setFormVisibleAdd] = useState(false);
	const [formVisibleEdit, setFormVisibleEdit] = useState(false);
	const [formVisibleDelete, setFormVisibleDelete] = useState(false);
	const [exercicios, setExercicios] = useState([{ id: 1, value: "" }]);

	const maxExercicios = 20;
	const listaExercicios = [
		{ id: "ex1", nome: "Supino Reto" },
		{ id: "ex2", nome: "Agachamento Livre" },
		{ id: "ex3", nome: "Remada Curvada" },
	];

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
		setExercicios([{ id: 1, value: "" }]);
	};

	const toggleFormEditVisible = () => {
		setFormVisibleEdit(!formVisibleEdit);
	};

	const toggleFormDeleteVisible = () => {
		setFormVisibleDelete(!formVisibleDelete);
	};

	const handleExercicioChange = (index, value) => {
		const novosExercicios = [...exercicios];
		novosExercicios[index].value = value;
		setExercicios(novosExercicios);
	};

	const adicionarExercicio = () => {
		if (exercicios.length < maxExercicios) {
			setExercicios([...exercicios, { id: exercicios.length + 1, value: "" }]);
		}
	};

	const removerExercicio = (index) => {
		const novosExercicios = exercicios.filter((_, i) => i !== index);

		// Reatribuir IDs sequenciais
		const exerciciosAtualizados = novosExercicios.map((exercicio, i) => ({
			...exercicio,
			id: i + 1, // Reorganiza os IDs a partir de 1
		}));

		setExercicios(exerciciosAtualizados);
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
				<p className="no-metas-message">Nenhum treino cadastrado.</p>
				<div className={`meta-content `}>
					<h2>Treino A</h2>
					<span className="treinos-list">Exercício 1 - 3x10</span>
					<div className="btn-edit-delete">
						<button className="btn-edit-treino" onClick={toggleFormEditVisible}>
							Editar
						</button>
						<button
							className="btn-remove-treino"
							onClick={toggleFormDeleteVisible}>
							Excluir
						</button>
					</div>
				</div>
			</div>

			{formVisibleAdd && (
				<div className="form-container">
					<div
						className="form-overlay"
						onClick={() => setFormVisibleAdd(false)}></div>
					<div className="form-content">
						<h2>Adicionar Treino</h2>
						<form className="form-add">
							<label htmlFor="treino">Nome do Treino</label>
							<input
								type="text"
								name="treino"
								placeholder="Digite o nome do treino"
								required
							/>
							{exercicios.map((exercicio, index) => (
								<div key={exercicio.id} className="select-btn-remove">
									<div className="form-group">
										<label htmlFor={`exercicio-${exercicio.id}`}>
											Exercício {exercicio.id}
										</label>
										<select
											name={`exercicio-${exercicio.id}`}
											id={`exercicio-${exercicio.id}`}
											value={exercicio.value}
											onChange={(e) =>
												handleExercicioChange(index, e.target.value)
											}
											className="select-exercicio"
											required>
											<option value="">Selecione um exercício</option>
											{listaExercicios.map((ex) => (
												<option key={ex.id} value={ex.id}>
													{ex.nome}
												</option>
											))}
										</select>
										{exercicio.value && (
											<div className="serie-repeticao-container">
												<label htmlFor="serie">Série</label>
												<input
													type="number"
													placeholder="Digite a quantidade de séries"
													id="serie"
													min="1"
													step="1"
													required
												/>
												<label htmlFor="repeticao">Repetição</label>
												<input
													type="number"
													placeholder="Digite a quantidade de repetições"
													id="repeticao"
													min="1"
													step="1"
													required
												/>
											</div>
										)}
									</div>
									{exercicios.length > 1 && (
										<button
											type="button"
											onClick={() => removerExercicio(index)}
											className="btn-remove">
											Remover
										</button>
									)}
								</div>
							))}
							{exercicios.length < maxExercicios && (
								<button
									type="button"
									onClick={adicionarExercicio}
									className="add-btn-exercicio">
									Adicionar Exercício
								</button>
							)}
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
						<h2>Editar Exercício</h2>
						<form className="form-add">
							<label htmlFor="name">Nome novo do Exercício</label>
							<input
								type="text"
								placeholder="Digite o novo nome do exercício"
								required
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
					<div className="form-overlay" onClick={toggleFormDeleteVisible}></div>
					<div className="form-content">
						<h2>Excluir Exercício</h2>
						<form className="form-delete-exercicio">
							<label htmlFor="name">Deseja excluir o exercício?</label>
							<div className="delete-btns">
								<button>SIM</button>
								<button>NÃO</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default Treinos;
