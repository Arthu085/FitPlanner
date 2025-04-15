import "./Agenda.css";

// components
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SideBar from "../../components/SideBar/SideBar";

// react
import { useEffect, useState } from "react";

// hooks
import { useAuth } from "../../hooks/useAuth";

const Agenda = () => {
	const [formAddVisible, setFormAddVisible] = useState(false);
	const [filtro, setFiltro] = useState("todas");
	const [dataFiltro, setDataFiltro] = useState("");

	const { isLoggedIn } = useAuth();

	// const userId = localStorage.getItem("id");

	useEffect(() => {
		isLoggedIn();
	}, []);

	const toggleFormAddVisible = () => {
		setFormAddVisible(!formAddVisible);
	};

	const limpaFiltroData = () => {
		setDataFiltro("");
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
						<label>Filtrar agenda:</label>
						<select
							id="filtro"
							value={filtro}
							onChange={(e) => setFiltro(e.target.value)}>
							<option value="todas">Todas</option>
							<option value="concluidas">Concluídas</option>
							<option value="atrasadas">Em Atraso</option>
						</select>
					</div>
					<div className="filtros">
						<label>Filtrar por data:</label>
						<input
							type="date"
							id="dataFiltro"
							value={dataFiltro}
							onChange={(e) => {
								setDataFiltro(e.target.value);
								setFiltro("todas"); // Isso agora vai atualizar corretamente o estado do filtro
							}}
						/>
						<button onClick={limpaFiltroData}>Limpar Data</button>
					</div>
				</div>
			</div>

			<div className="metas-list">
				<p className="no-metas-message">
					Nenhuma meta encontrada para o filtro selecionado.
				</p>
				<div className={`meta-content`}>
					<h2>Treino A</h2>
					<div className="span-datas">
						<span>Data do treino:</span>
						<span>Hora do treino:</span>
						<input type="checkbox" />
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
							<label>Selecione o treino</label>
							<select name="treino" id="treino" required>
								<option value="1">Treino 1</option>
								<option value="2">Treino 2</option>
								<option value="3">Treino 3</option>
							</select>
							<label>Data e hora</label>
							<input
								type="datetime-local"
								name="data"
								min={new Date().toISOString().slice(0, 16)}
								required
							/>
							<button type="submit" className="add-btn">
								Adicionar
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default Agenda;
