import { AnimatePresence, motion } from "framer-motion";

export default function Toast({ toasts }) {
	return (
		<div className="fixed top-5 right-5 z-50 space-y-2">
			<AnimatePresence>
				{toasts.map((toast) => (
					<motion.div
						key={toast.id}
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 40 }}
						transition={{ duration: 0.3 }}
						className={`px-4 py-2 rounded shadow text-white transition-all
                            ${
															toast.type === "success"
																? "bg-green-500"
																: toast.type === "error"
																? "bg-red-500"
																: toast.type === "warning"
																? "bg-yellow-500"
																: "bg-blue-500"
														}`}>
						{toast.message}
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
}
