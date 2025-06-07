import { useState } from "react";
import Container from "../../components/Container";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import SideBar from "../../components/SideBar";
import Table from "../../components/Table";

const Home = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const headers = ["Treino", "Data Iniciado", "Data finalizado", "Situação"];
	const data = [
		["João", "joao@email.com", "Ativo", "A"],
		["Maria", "maria@email.com", "Inativo"],
	];

	return (
		<Container>
			<Header />
			<SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
			<Layout isSidebarOpen={isSidebarOpen} title="Dashboard">
				<section className="space-y-2 mt-7 mb-5">
					<h2 className="text-2xl font-semibold text-black dark:text-white">
						Olá, Fulano
					</h2>
					<p className="text-black dark:text-white">
						Essa é a sua tela de <strong>dashboard</strong>.
					</p>
					<p className="text-black dark:text-white">
						Aqui você pode visualizar todas as suas{" "}
						<strong>sessões de treino</strong>.
					</p>
				</section>
				<Table
					headers={headers}
					columns={3}
					data={data}
					renderActions={(row) => (
						<div className="flex gap-2">
							<button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
								Editar
							</button>
							<button className="bg-red-500 text-white px-3 py-1 rounded text-sm">
								Excluir
							</button>
						</div>
					)}
				/>
			</Layout>
			<Footer />
		</Container>
	);
};

export default Home;
