export default function Buttons({
	colorBg,
	colorHover,
	submit,
	text,
	onClick,
	disabled = false,
	loadingText = "Carregando...",
	type,
	width = "w-full",
	disabledWidth = "w-full",
	title = "",
}) {
	if (type === "primary") {
		colorBg = "bg-blue-500";
		colorHover = "hover:bg-blue-700";
	} else if (type === "info") {
		colorBg = "bg-sky-700";
		colorHover = "hover:bg-sky-900";
	} else if (type === "success") {
		colorBg = "bg-green-700";
		colorHover = "hover:bg-green-900";
	} else if (type === "warning") {
		colorBg = "bg-red-600";
		colorHover = "hover:bg-red-800";
	} else if (type === "secondary") {
		colorBg = "bg-gray-500";
		colorHover = "hover:bg-gray-800";
	}

	return (
		<button
			onClick={onClick}
			title={title}
			type={submit}
			className={`${
				disabled ? disabledWidth : width
			} font-semibold py-2 px-4 rounded-lg transition duration-300 ${
				disabled
					? "bg-gray-400 cursor-not-allowed"
					: `${colorBg} ${colorHover} cursor-pointer`
			} text-white`}
			disabled={disabled}>
			{disabled ? loadingText : text}
		</button>
	);
}
