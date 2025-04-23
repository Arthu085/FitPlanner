import "./NavigationBar.css";

// hooks
import { useAuth } from "../../hooks/useAuth";

// react
import { useNavigate } from "react-router-dom";
import { LogOut, House } from "lucide-react";

const NavigationBar = () => {
	const { logout } = useAuth();

	const navigate = useNavigate();

	return (
		<nav className="navigation-bar-container">
			<div title="Página Inicial" onClick={() => navigate("/home")}>
				<House className="home-icon cursor-pointer" />
			</div>
			<div title="Sair" onClick={logout}>
				<LogOut className="logout-icon" />
			</div>
		</nav>
	);
};

export default NavigationBar;
