export default function Buttons({
	colorBg,
	colorHover,
	submit,
	text,
	onClick,
	disabled = false,
	loadingText = "Carregando...",
}) {
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
