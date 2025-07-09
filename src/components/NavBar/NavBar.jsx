import LogoutIcon from "./LogoutIcon";
import logo from "../../assets/images/logo.svg";

import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function NavBar({ showHome, showLogout }) {
	const { logout } = useAuth();

	return (
		<nav className="flex items-center gap-4">
			{showHome && (
				<Link
					to="/"
					className="text-white inline-block"
					aria-label="Dashboard"
					title="Dashboard">
					<img
						src={logo}
						alt="Logo FitPlanner"
						className="dark:invert w-13 transition-transform duration-300 ease-in-out hover:scale-110"
						loading="lazy"
					/>
				</Link>
			)}
			{showLogout && (
				<button
					onClick={logout}
					className="text-white"
					aria-label="Sair"
					title="Sair">
					<LogoutIcon />
				</button>
			)}
		</nav>
	);
}
