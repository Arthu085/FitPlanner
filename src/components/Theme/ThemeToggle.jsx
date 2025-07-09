import ThemeIconLight from "./ThemeIconLight";
import ThemeIconDark from "./ThemeIconDark";

import { useTheme } from "../../contexts/ThemeContext";

export default function ThemeToggle({ isVisible = true, size }) {
	const { theme, setTheme } = useTheme();

	return (
		<button
			className={`
				cursor-pointer p-2 rounded-full dark:invert
				hover:bg-gray-200 dark:hover:bg-gray-600 
				active:bg-gray-300 dark:active:bg-gray-700
				transition-opacity duration-300
				${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
			`}
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			aria-label="Alternar tema">
			{theme === "dark" ? (
				<ThemeIconLight size={size} />
			) : (
				<ThemeIconDark size={size} />
			)}
		</button>
	);
}
