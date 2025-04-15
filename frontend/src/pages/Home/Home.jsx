import "./Home.css";

// react
import { useEffect, useState } from "react";

// components
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SideBar from "../../components/SideBar/SideBar";

// hooks
import { useAuth } from "../../hooks/useAuth";

const Home = () => {
	const [userData, setUserData] = useState(null);

	const { userId, isLoggedIn } = useAuth();

	useEffect(() => {
		isLoggedIn();
	}, []);

	const getUser = async () => {
		if (userId) {
			try {
				const response = await fetch(
					`http://localhost:3000/api/user/getuser/${userId}`
				);
				const data = await response.json();
				if (data.data) {
					setUserData(data.data);
				} else {
					console.error("Usuário não encontrado");
				}
			} catch (error) {
				console.error("Erro ao buscar usuário", error);
			}
		}
	};

	useEffect(() => {
		getUser();
	}, [userId]);

	return (
		<div className="home-container">
			<NavigationBar />
			<SideBar />
			<div className="home-informacoes">
				{userData ? ( // Verifica se os dados do usuário existem antes de acessar
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
