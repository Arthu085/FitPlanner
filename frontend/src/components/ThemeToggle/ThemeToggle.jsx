import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ className = "" }) {
	const { theme, toggleTheme } = useTheme();
	const [hovered, setHovered] = useState(false);

	const baseStyle = {
		backgroundColor: hovered
			? theme === "light"
				? "rgba(0, 0, 0, 0.33)"
				: "rgba(255, 255, 255, 0.1)"
			: "transparent",
		border: "none",
		cursor: "pointer",
		borderRadius: "100%",
		padding: "8px",
		transition: "background-color 0.2s ease",
	};

	const iconStyle = {
		width: "45px",
		height: "45px",
		filter: theme === "dark" ? "invert(1)" : "none",
	};

	return (
		<button
			onClick={toggleTheme}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			style={baseStyle}
			className={className}>
			{theme === "light" ? (
				<Moon style={iconStyle} />
			) : (
				<Sun style={iconStyle} />
			)}
		</button>
	);
}
