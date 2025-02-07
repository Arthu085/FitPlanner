import React, { useEffect, useState } from 'react'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import SideBar from '../../components/SideBar/SideBar'
import { useNavigate } from 'react-router-dom'
import './Exercicios.css'

const Exercicios = () => {

    const [formVisibleAdd, setFormVisibleAdd] = useState(false);
    const userId = localStorage.getItem('id');
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
          alert('Faça login no sistema');
          navigate('/'); // Redireciona para a página de login se o id não existir
          localStorage.removeItem('id');
        }
      }, [userId, navigate]);

      const toggleForm = () => {
        setFormVisibleAdd(!formVisibleAdd);
      };
    
  return (
    <div className='sidebar-pages-container'>
        <NavigationBar/>
        <SideBar/>
        <div className='exercicios-list'>
            <div className='h2-addbutton'>
                <h2>Lista de Exercícios</h2>
                <button className='add-exercise-btn' onClick={toggleForm}>Adicionar Exercício</button>
            </div>
            <div className='list-btns'>
                <span>Supino</span>
                <div className='edit-delete-btns'>
                    <button>Editar</button>
                    <button>Excluir</button>
                </div>
            </div>
        </div>
        {formVisibleAdd && (
            <div className='form-container'>
            <div className='form-overlay' onClick={toggleForm}></div>
                <div className='form-content'>
                    <h2>Adicionar Exercício</h2>
                    <form className='form-add-exercicio'>
                        <label htmlFor="name">Nome do Exercício</label>
                        <input type="text" placeholder='Digite o nome do exercício'/>
                        <button type='submit'>Adicionar</button>
                    </form>
                </div>
            </div>
        )}
    </div>
  )
}

export default Exercicios