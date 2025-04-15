import "./Home.css";

// react
import { useEffect, useState } from "react";

// components
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SideBar from "../../components/SideBar/SideBar";

// hooks
import { useAuth } from "../../hooks/useAuth";
import { fetchUser } from "../../hooks/api/homeApi";

const Home = () => {
	const [userData, setUserData] = useState([]);

	const { userId, isLoggedIn } = useAuth();

	useEffect(() => {
		isLoggedIn();
	}, []);

	useEffect(() => {
		const loadUser = async () => {
			try {
				const data = await fetchUser(userId);
				setUserData(data.data);
			} catch (error) {
				alert("Erro ao buscar usuário");
			}
		};

		loadUser();
	}, [userId]);

	return (
		<div className="home-container">
			<NavigationBar />
			<SideBar />
			<div className="home-informacoes">
				{userData ? (
					<div>
						<div className="user-informacoes">
							<h1>
								Olá, {userData.name_user} {userData.lastname_user}{" "}
							</h1>
							<div>
								<span className="span-home">Treino Atual: </span>
								<span className="span-home">Total de Treinos Concluídos: </span>
								<span className="span-home">Média de Treinos por semana: </span>
								<span className="span-home">
									Meta: 4 treinos por semana | Progresso: 2/4
								</span>
							</div>
						</div>
						<div className="treinos-concluidos">
							<h2>Últimos Treinos Concluídos:</h2>
							<span className="span-home">
								Treino A | 23/02/2025 | Duração de 1 hora e 40 minutos
							</span>
						</div>
					</div>
				) : (
					<p>Carregando informações do usuário...</p>
				)}
			</div>
		</div>
	);
};

export default Home;
