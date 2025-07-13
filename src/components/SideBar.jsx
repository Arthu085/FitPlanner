import ThemeToggle from "./Theme/ThemeToggle";

import { useNavigate } from "react-router-dom";

export default function Sidebar({ isOpen, setIsOpen }) {
	const menuItems = [
		{ label: "Dashboard", page: "" },
		{ label: "Sessão de Treino", page: "session/training" },
		{ label: "Treinos", page: "training" },
		{ label: "Exercícios", page: "exercise" },
	];

	const navigate = useNavigate();

	return (
		<aside
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
			className={`
		fixed top-0 left-0 h-full z-40
		bg-gray-500 dark:bg-gray-800  rounded-r-3xl
		transition-[width,background-color] duration-300 ease-in-out
		flex flex-col
		${isOpen ? "w-52 px-6 py-8" : "w-10 px-2 py-8"}
		overflow-hidden
	  `}>
			{isOpen && (
				<>
					<h1 className="text-2xl font-bold text-black dark:text-white mt-16 mb-5 whitespace-nowrap transition-opacity duration-300 opacity-100">
						FitPlanner
					</h1>
					<nav className="flex flex-col gap-4 flex-1 max-h-[1000px] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
						{menuItems.map(({ label, page }) => (
							<button
								key={label}
								className="text-black dark:text-white flex items-center gap-4 w-full hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 focus:outline-none cursor-pointer px-2 py-3"
								onClick={() => navigate(`/${page}`)}>
								<span className="whitespace-nowrap transition-opacity duration-300 opacity-100">
									{label}
								</span>
							</button>
						))}
					</nav>
					<div className="mt-auto mb-2">
						<ThemeToggle isVisible={isOpen} size={"size-8"} />
					</div>
					<footer className="text-black dark:text-white mt-auto text-sm whitespace-nowrap transition-opacity duration-300 opacity-100">
						© 2025 FitPlanner
					</footer>
				</>
			)}
		</aside>
	);
}
