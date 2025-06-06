export default function Container({
	children,
	centered = false,
	className = "",
}) {
	return (
		<div
			className={`relative w-full min-h-screen mx-auto bg-gray-300 dark:bg-gray-700 ${
				centered ? "flex flex-col items-center justify-center" : ""
			} ${className}`}>
			{children}
		</div>
	);
}
