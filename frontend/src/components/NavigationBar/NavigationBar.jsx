import "./NavigationBar.css";

// hooks
import { useAuth } from "../../hooks/useAuth";

// react
import { useNavigate } from "react-router-dom";

const NavigationBar = () => {
	const { logout } = useAuth();

	const navigate = useNavigate();

	return (
		<nav className="navigation-bar-container">
			<div>
				<button className="home-button" onClick={() => navigate("/home")}>
					Fit Planner
				</button>
				<button className="logout-button" onClick={logout}>
					Sair
				</button>
			</div>
		</nav>
	);
};

export default NavigationBar;
