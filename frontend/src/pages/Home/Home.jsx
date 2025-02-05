import NavigationBar from '../../components/NavigationBar/NavigationBar'
import SideBar from '../../components/SideBar/SideBar'
import './Home.css'

const Home = () => {
  return (
    <div className='home-container'>
        <NavigationBar />
        <SideBar />
        <div className='home-informacoes'>
            <div className='user-informacoes'>
              <h1>Olá, </h1>
              <div>
                <span className='span-home'>Treino Atual: </span>
                <span className='span-home'>Total de Treinos Concluídos: </span>
                <span className='span-home'>Média de Treinos por semana: </span>
                <span className='span-home'>Meta: 4 treinos por semana | Progresso: 2/4</span>
              </div>
            </div>
            <div className='treinos-concluidos'>
              <h2>Últimos Treinos Concluídos:</h2>
              <span className='span-home'>Treino A | 23/02/2025 | Duração de 1 hora e 40 minutos</span>
            </div>
        </div>
    </div>
  )
}

export default Home