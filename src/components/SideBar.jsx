import { useNavigate } from "react-router-dom";
import ThemeToggle from "./Theme/ThemeToggle";

export default function Sidebar({ isOpen, setIsOpen }) {
	const menuItems = [
		{ label: "Sessão de Treino", page: "session/training" },
		{ label: "Treinos", page: "training" },
	];

	const navigate = useNavigate();

	return (
		<aside
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
			className={`
        fixed top-0 left-0 h-full z-40
        bg-gray-500 dark:bg-gray-800 shadow-xl rounded-r-3xl
        transition-all duration-300 ease-in-out
        flex flex-col
        ${isOpen ? "w-52 px-6 py-8" : "w-10 px-2 py-8"}
        overflow-hidden
      `}>
			<h1
				className={`
          text-2xl font-bold text-black dark:text-white mt-10 mb-5
          whitespace-nowrap transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}>
				FitPlanner
			</h1>

			<nav className="flex flex-col gap-4 flex-1">
				{menuItems.map(({ label, page }) => (
					<button
						key={label}
						className="text-black dark:text-white flex items-center gap-4 w-full hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 focus:outline-none cursor-pointer px-2 py-3"
						onClick={() => navigate(`/${page}`)}>
						<span
							className={`whitespace-nowrap transition-opacity duration-300 ${
								isOpen ? "opacity-100" : "opacity-0"
							}`}>
							{label}
						</span>
					</button>
				))}
			</nav>

			<div className="mt-auto mb-2">
				<ThemeToggle isVisible={isOpen} size={"size-8"} />
			</div>

			<footer
				className={`text-black dark:text-white mt-auto text-sm whitespace-nowrap transition-opacity duration-300 ${
					isOpen ? "opacity-100" : "opacity-0"
				}`}>
				© 2025 FitPlanner
			</footer>
		</aside>
	);
}
