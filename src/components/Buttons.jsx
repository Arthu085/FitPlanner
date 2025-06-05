export default function Buttons({
	colorBg,
	colorHover,
	submit,
	text,
	onClick,
}) {
	return (
		<button
			onClick={onClick}
			type={submit}
			className={`cursor-pointer w-full text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ${colorBg} ${colorHover}`}>
			{text}
		</button>
	);
}
