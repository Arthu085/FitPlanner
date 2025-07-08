import { Link } from "react-router-dom";

import Container from "../../components/Container";

export default function NotFound() {
	return (
		<Container centered={true}>
			<h1 className="text-4xl font-bold mb-4 text-black dark:text-white">
				404 - Página não encontrada
			</h1>
			<p className="mb-6 text-black dark:text-white">
				A página que você está procurando não existe.
			</p>
			<Link to="/login" className="text-blue-600 hover:underline font-semibold">
				Voltar para página de login
			</Link>
		</Container>
	);
}
