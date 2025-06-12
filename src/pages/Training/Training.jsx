import Buttons from "../../components/Buttons";
import Container from "../../components/Container";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import SideBar from "../../components/SideBar";
import Card from "../../components/Card";

import { useState } from "react";

const Training = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const data = [
		{ id: 1, title: "Treino A", description: "Peito e tríceps" },
		{ id: 2, title: "Treino B", description: "Costas e bíceps" },
	];

	return (
		<>
			{loading && <LoadingScreen />}

			<Container>
				<Header />
				<SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
				<Layout isSidebarOpen={isSidebarOpen} title="Treinos">
					<section className="space-y-2 mt-7 mb-5 flex flex-row justify-between items-center">
						<div>
							<p className="text-black dark:text-white">
								Essa é a sua tela de <strong>treinos</strong>.
							</p>
							<p className="text-black dark:text-white">
								Aqui você pode visualizar, criar, editar e excluir{" "}
								<strong>treinos</strong>.
							</p>
						</div>
						<div>
							<Buttons text={"Novo Treino"} type={"primary"} />
						</div>
					</section>

					<Card
						data={data}
						titleKey="title"
						renderContent={(item) => <p>{item.description}</p>}
						renderActions={(item) => (
							<>
								<button
									onClick={() => alert(`Editando ${item.title}`)}
									className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition">
									Editar
								</button>
								<button
									onClick={() => alert(`Removendo ${item.title}`)}
									className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition">
									Remover
								</button>
							</>
						)}
					/>
				</Layout>
				<Footer />
			</Container>
		</>
	);
};

export default Training;
