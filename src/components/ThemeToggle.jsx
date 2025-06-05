// Exemplo de botão para alternar tema
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
			Alternar para {theme === "dark" ? "claro" : "escuro"}
		</button>
	);
}
