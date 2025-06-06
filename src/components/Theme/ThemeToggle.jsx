import { useTheme } from "../../contexts/ThemeContext";
import ThemeIconLight from "./ThemeIconLight";
import ThemeIconDark from "./ThemeIconDark";

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<button
			className="cursor-pointer p-2 rounded-full transition 
		hover:bg-gray-200 dark:hover:bg-gray-600 
		active:bg-gray-300 dark:active:bg-gray-700"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
			{theme === "dark" ? <ThemeIconLight /> : <ThemeIconDark />}
		</button>
	);
}
