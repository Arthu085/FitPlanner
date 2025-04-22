import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();
	const [hovered, setHovered] = useState(false);

	const baseStyle = {
		backgroundColor: hovered
			? theme === "light"
				? "rgba(0, 0, 0, 0.33)" // fundo preto transparente no tema claro
				: "rgba(255, 255, 255, 0.1)" // fundo branco transparente no tema escuro
			: "transparent",
		border: "none",
		cursor: "pointer",
		borderRadius: "100%",
		padding: "8px",
		transition: "background-color 0.2s ease",
	};

	const iconStyle = {
		width: "50px",
		height: "50px",
		filter: theme === "dark" ? "invert(1)" : "none",
	};

	return (
		<button
			onClick={toggleTheme}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			style={baseStyle}>
			{theme === "light" ? (
				<Moon style={iconStyle} />
			) : (
				<Sun style={iconStyle} />
			)}
		</button>
	);
}
