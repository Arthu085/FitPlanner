import './SideBar.css'

const SideBar = () => {
  return (
    <div className="side-bar-container">
        <div className='buttons-img'>
          <img className='img-sidebar' src="../../public/images/treino.png" alt="Treino icone" />
          <button className='buttons-sidebar'>Treinos</button>
        </div>
        <div className='buttons-img'>
          <img className='img-sidebar' src="../../public/images/horarios.png" alt="Horário icone" />
          <button className='buttons-sidebar'>Horários</button>
        </div>
        <div className='buttons-img'>
          <img className='img-sidebar' src="../../public/images/exercicios.png" alt="Exercício icone" />
          <button className='buttons-sidebar'>Exercícios</button>
        </div>
        <div className='buttons-img'>
          <img className='img-sidebar' src="../../public/images/metas.png" alt="Meta icone" />
          <button className='buttons-sidebar'>Metas</button>
        </div>
    </div>
  )
}

export default SideBar