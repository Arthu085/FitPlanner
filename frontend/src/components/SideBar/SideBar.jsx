import "./SideBar.css";

import { useNavigate } from "react-router-dom";
import { Goal, Dumbbell, History, NotebookTabs } from "lucide-react";

import ThemeToggle from "../ThemeToggle/ThemeToggle";

const SideBar = () => {
	const navigate = useNavigate();

	const buttons = [
		{
			icon: <NotebookTabs size={38} />,
			alt: "Treino",
			title: "Treinos",
			route: "/treinos",
			className: "treino-icon",
		},
		{
			icon: <History size={38} />,
			alt: "Horário",
			title: "Agenda",
			route: "/agenda",
		},
		{
			icon: <Dumbbell size={38} />,
			alt: "Exercício",
			title: "Exercícios",
			route: "/exercicios",
		},
		{
			icon: <Goal size={38} />,
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
						onClick={() => navigate(btn.route)}
						title={btn.title}>
						{btn.icon ? (
							<div className="icon-sidebar">{btn.icon}</div>
						) : (
							<img
								className={`img-sidebar ${btn.className || ""}`}
								src={btn.src}
								alt={`${btn.alt} ícone`}
							/>
						)}
					</div>
				))}
			</div>
			<ThemeToggle className="theme-btn" />
		</div>
	);
};

export default SideBar;
