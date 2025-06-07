export default function Buttons({
	colorBg,
	colorHover,
	submit,
	text,
	onClick,
	disabled = false,
	loadingText = "Carregando...",
	type,
}) {
	if (type === "primary") {
		colorBg = "bg-blue-500";
		colorHover = "hover:bg-blue-700";
	} else if (type === "info") {
		colorBg = "bg-yellow-300";
		colorHover = "hover:bg-yellow-500";
	} else if (type === "success") {
		colorBg = "bg-green-700";
		colorHover = "hover:bg-green-900";
	} else if (type === "warning") {
		colorBg = "bg-red-600";
		colorHover = "hover:bg-red-800";
	}

	return (
		<button
			onClick={onClick}
			type={submit}
			className={`cursor-pointer w-full font-semibold py-2 px-4 rounded-lg transition duration-300 
				${disabled ? "bg-gray-400 cursor-not-allowed" : `${colorBg} ${colorHover}`} 
				text-white`}
			disabled={disabled}>
			{disabled ? loadingText : text}
		</button>
	);
}
