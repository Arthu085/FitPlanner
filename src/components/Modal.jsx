import { useEffect, useState } from "react";

export default function Modal({ isOpen, onClose, title, content, actions }) {
	const [show, setShow] = useState(false);
	const [animate, setAnimate] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setShow(true);
			setTimeout(() => setAnimate(true), 20);
		} else {
			setAnimate(false);
			const timeout = setTimeout(() => setShow(false), 500);
			return () => clearTimeout(timeout);
		}
	}, [isOpen]);

	if (!show) return null;

	return (
		<div
			onClick={onClose}
			className={`fixed inset-0 z-70 flex items-center justify-center bg-black/70 transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
				animate ? "opacity-100" : "opacity-0 pointer-events-none"
			}`}>
			<div
				onClick={(e) => e.stopPropagation()}
				className={`bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full p-6 relative
          transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${
						animate
							? "opacity-100 scale-100 translate-y-0"
							: "opacity-0 scale-90 translate-y-8"
					}
        `}>
				<button
					onClick={onClose}
					aria-label="Fechar modal"
					className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl">
					&times;
				</button>

				<div className="flex flex-col gap-6">
					{title && (
						<h2 className="text-xl font-bold border-b border-gray-300 dark:border-gray-600 pb-3">
							{title}
						</h2>
					)}

					{content && (
						<div className="text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600 pb-3">
							{content}
						</div>
					)}

					{actions && (
						<div className="flex justify-end gap-3 pt-3">{actions}</div>
					)}
				</div>
			</div>
		</div>
	);
}
