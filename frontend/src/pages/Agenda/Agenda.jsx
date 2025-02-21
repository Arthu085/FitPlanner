import { useNavigate } from "react-router-dom";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SideBar from "../../components/SideBar/SideBar";
import "./Agenda.css";
import { useEffect, useState } from "react";

const Agenda = () => {
	const [formAddVisible, setFormAddVisible] = useState(false);

	const navigate = useNavigate();
	const userId = localStorage.getItem("id");
	useEffect(() => {
		if (!userId) {
			alert("Faça login no sistema");
			navigate("/");
			localStorage.removeItem("id");
		}
	}, [userId, navigate]);

	const toggleFormAddVisible = () => {
		setFormAddVisible(!formAddVisible);
	};

	return (
		<div className="sidebar-pages-container">
			<NavigationBar />
			<SideBar />
			<div className="agenda-container">
				<h2>Agenda de Treinos</h2>
				<div className="filtro-btn-container">
					<button className="btn-add-agenda" onClick={toggleFormAddVisible}>
						Agendar Treino
					</button>
					<div className="filtros">
						<label htmlFor="filtro">Filtrar agenda:</label>
						<select id="filtro">
							<option value="todas">Todas</option>
							<option value="concluidas">Concluídas</option>
							<option value="andamento">Em Andamento</option>
							<option value="atrasadas">Em Atraso</option>
						</select>
					</div>
				</div>
			</div>

			{formAddVisible && (
				<div className="form-container">
					<div
						className="form-overlay"
						onClick={() => setFormAddVisible(false)}></div>
					<div className="form-content">
						<h2>Adicionar Data de Treino</h2>
						<form className="form-add">
							<label htmlFor="treino">Selecione o treino</label>
							<select name="treino" id="treino" required>
								<option value="1">Treino 1</option>
								<option value="2">Treino 2</option>
								<option value="3">Treino 3</option>
							</select>
							<label htmlFor="data">Data e hora</label>
							<input
								type="datetime-local"
								name="data"
								min={new Date().toISOString().slice(0, 16)}
								required
							/>
							<button type="submit">Adicionar</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default Agenda;
