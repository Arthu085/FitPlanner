import "./SideBar.css";

import { useNavigate } from "react-router-dom";

import ThemeToggle from "../ThemeToggle/ThemeToggle";

const SideBar = () => {
	const navigate = useNavigate();

	const buttons = [
		{
			src: "../../images/treino.png",
			alt: "Treino",
			title: "Treinos",
			route: "/treinos",
			className: "treino-icon",
		},
		{
			src: "../../images/horarios.png",
			alt: "Horário",
			title: "Agenda",
			route: "/agenda",
		},
		{
			src: "../../images/exercicios.png",
			alt: "Exercício",
			title: "Exercícios",
			route: "/exercicios",
		},
		{
			src: "../../images/metas.png",
			alt: "Meta",
			title: "Metas",
			route: "/metas",
		},
	];

	return (
		<div className="side-bar-container">
			<div>
				{buttons.map((btn, index) => (
					<div
						key={index}
						className="buttons-img"
						onClick={() => navigate(btn.route)}>
						<img
							className={`img-sidebar ${btn.className || ""}`}
							src={btn.src}
							alt={`${btn.alt} ícone`}
							title={btn.title}
						/>
					</div>
				))}
			</div>
			<ThemeToggle className="theme-btn" />
		</div>
	);
};

export default SideBar;
