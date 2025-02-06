import { useEffect, useState } from 'react'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import SideBar from '../../components/SideBar/SideBar'
import './Home.css'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const [userData, setUserData] = useState(null);
  const userId = localStorage.getItem('id');
  const navigate = useNavigate();

  const getUser = async () => {
    if (userId) {
      try {
        const response = await fetch(`http://localhost:3000/api/user/getuser/${userId}`);
        const data = await response.json();
        if (data.data) {
          setUserData(data.data);
        } else {
          console.error('Usuário não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar usuário', error);
      }
    }
  };

  useEffect(() => {
    if (!userId) {
      alert('Você precisa estar logado');
      navigate('/'); // Redireciona para a página de login se o id não existir
      localStorage.removeItem('id');
    } else {
      getUser();
    }
  }, [userId, navigate]);

  return (
    <div className='home-container'>
        <NavigationBar />
        <SideBar />
        <div className='home-informacoes'>
        {userData ? ( // Adiciona uma verificação antes de acessar userData
          <div className='user-informacoes'>
            <h1>Olá, {userData.name_user} {userData.lastname_user} </h1>
            <div>
              <span className='span-home'>Treino Atual: </span>
              <span className='span-home'>Total de Treinos Concluídos: </span>
              <span className='span-home'>Média de Treinos por semana: </span>
              <span className='span-home'>Meta: 4 treinos por semana | Progresso: 2/4</span>
            </div>
          </div>
        ) : (
          <p>Carregando informações do usuário...</p>
        )}
            <div className='treinos-concluidos'>
              <h2>Últimos Treinos Concluídos:</h2>
              <span className='span-home'>Treino A | 23/02/2025 | Duração de 1 hora e 40 minutos</span>
            </div>
        </div>
    </div>
  )
}

export default Home