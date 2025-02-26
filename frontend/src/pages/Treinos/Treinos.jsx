import React, { useEffect, useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SideBar from "../../components/SideBar/SideBar";
import { useNavigate } from "react-router-dom";
import "./Treinos.css";

const Treinos = () => {
	const [formAddVisible, setFormAddVisible] = useState(false);
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
		setFormAddVisible(!formAddVisible);
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
		setExercicios(novosExercicios);
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

			{formAddVisible && (
				<div className="form-container">
					<div
						className="form-overlay"
						onClick={() => setFormAddVisible(false)}></div>
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
											required>
											<option value="">Selecione um exercício</option>
											{listaExercicios.map((ex) => (
												<option key={ex.id} value={ex.id}>
													{ex.nome}
												</option>
											))}
										</select>
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
		</div>
	);
};

export default Treinos;
