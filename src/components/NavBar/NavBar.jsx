import HomeIcon from "./HomeIcon";
import LogoutIcon from "./LogoutIcon";

import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function NavBar({ showHome, showLogout }) {
	const { logout } = useAuth();

	return (
		<nav className="flex items-center gap-4">
			{showHome && (
				<Link to="/" className="text-white">
					<HomeIcon />
				</Link>
			)}
			{showLogout && (
				<button onClick={logout} className="text-white">
					<LogoutIcon />
				</button>
			)}
		</nav>
	);
}
