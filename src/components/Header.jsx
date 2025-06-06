import NavBar from "./NavBar/NavBar";

export default function Header() {
	return (
		<header className="bg-white dark:bg-gray-900 sticky top-0 z-60 w-full flex items-center justify-between py-4 px-6">
			<NavBar showHome />
			<h2 className="text-lg font-bold text-black dark:text-white">
				FitPlanner
			</h2>
			<NavBar showLogout />
		</header>
	);
}
