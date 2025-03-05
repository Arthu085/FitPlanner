import { useNavigate } from "react-router-dom";
import "./SideBar.css";

const SideBar = () => {
	const navigate = useNavigate();

	return (
		<div className="side-bar-container">
			<div className="buttons-img">
				<img
					className="img-sidebar"
					src="../../images/treino.png"
					alt="Treino icone"
				/>
				<button
					className="buttons-sidebar"
					onClick={() => navigate("/treinos")}>
					Treinos
				</button>
			</div>
			<div className="buttons-img">
				<img
					className="img-sidebar"
					src="../../images/horarios.png"
					alt="Horário icone"
				/>
				<button className="buttons-sidebar" onClick={() => navigate("/agenda")}>
					Agenda
				</button>
			</div>
			<div className="buttons-img">
				<img
					className="img-sidebar"
					src="../../images/exercicios.png"
					alt="Exercício icone"
				/>
				<button
					className="buttons-sidebar"
					onClick={() => navigate("/exercicios")}>
					Exercícios
				</button>
			</div>
			<div className="buttons-img">
				<img
					className="img-sidebar"
					src="../../images/metas.png"
					alt="Meta icone"
				/>
				<button className="buttons-sidebar" onClick={() => navigate("/metas")}>
					Metas
				</button>
			</div>
		</div>
	);
};

export default SideBar;
