import Buttons from "../../components/Buttons";
import Container from "../../components/Container";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import SideBar from "../../components/SideBar";
import Card from "../../components/Card";

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { fetchTraining } from "../../api/trainingApi";
import LoadingScreen from "../../components/LoadingScreen";
import DetailsIcon from "./DetailsIcon";

const Training = () => {
	const { user } = useAuth();
	const token = user?.token;

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [training, setTraining] = useState([]);

	const loadTraining = async () => {
		try {
			setLoading(true);
			const data = await fetchTraining(token);
			setTraining(data);
		} catch (error) {
			console.error("Erro ao buscar treinos:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadTraining();
	}, [token]);

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
						data={training}
						renderActions={(item) => (
							<div className="flex flex-row items-center justify-between w-full">
								<div>
									<DetailsIcon />
								</div>
								<div className="flex gap-3">
									<Buttons type={"primary"} text={`Editar`} width="w-24" />
									<Buttons type={"warning"} text={`Excluir`} width="w-24" />
								</div>
							</div>
						)}
					/>
				</Layout>
				<Footer />
			</Container>
		</>
	);
};

export default Training;
