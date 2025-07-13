export default function Layout({ children, isSidebarOpen, title }) {
	return (
		<div
			className={`transition-all duration-300 pt-8 px-4 py-6 bg-gray-300 dark:bg-gray-700 min-h-screen ${
				isSidebarOpen ? "ml-52" : "ml-10"
			}`}>
			<h1 className="text-black dark:text-white text-4xl font-bold">{title}</h1>
			{children}
		</div>
	);
}
