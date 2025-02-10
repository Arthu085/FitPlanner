import React, { useEffect, useState } from 'react'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import SideBar from '../../components/SideBar/SideBar'
import { useNavigate } from 'react-router-dom'
import './Exercicios.css'

const Exercicios = () => {

    const [formVisibleAdd, setFormVisibleAdd] = useState(false);
    const [formVisibleEdit, setFormVisibleEdit] = useState(false);
    const [formVisibleDelete, setFormVisibleDelete] = useState(false);

    const userId = localStorage.getItem('id');
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
          alert('Faça login no sistema');
          navigate('/'); // Redireciona para a página de login se o id não existir
          localStorage.removeItem('id');
        }
      }, [userId, navigate]);

      const toggleFormAdd = () => {
        setFormVisibleAdd(!formVisibleAdd);
      };

      const toggleFormEdit = () => {
        setFormVisibleEdit(!formVisibleEdit);
      };

      const toggleFormDelete = () => {
        setFormVisibleDelete(!formVisibleDelete);
      };
    
  return (
    <div className='sidebar-pages-container'>
        <NavigationBar/>
        <SideBar/>
        <div className='exercicios-list'>
            <div className='h2-addbutton'>
                <h2>Lista de Exercícios</h2>
                <button className='add-exercise-btn' onClick={toggleFormAdd}>Adicionar Exercício</button>
            </div>
            <div className='list-btns'>
                <span>Supino</span>
                <div className='edit-delete-btns'>
                    <button  onClick={toggleFormEdit}>Editar</button>
                    <button onClick={toggleFormDelete}>Excluir</button>
                </div>
            </div>
        </div>
        {formVisibleAdd && (
            <div className='form-container'>
            <div className='form-overlay' onClick={toggleFormAdd}></div>
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
        {formVisibleEdit && (
            <div className='form-container'>
            <div className='form-overlay' onClick={toggleFormEdit}></div>
                <div className='form-content'>
                    <h2>Editar Exercício</h2>
                    <form className='form-add-exercicio'>
                        <label htmlFor="name">Nome novo do Exercício</label>
                        <input type="text" placeholder='Digite o novo nome do exercício'/>
                        <button type='submit'>Salvar</button>
                    </form>
                </div>
            </div>            
        )}
        {formVisibleDelete && (
            <div className='form-container'>
            <div className='form-overlay' onClick={toggleFormDelete}></div>
                <div className='form-content'>
                    <h2>Excluir Exercício</h2>
                    <form className='form-delete-exercicio'>
                        <label htmlFor="name">Deseja excluir o exercício?</label>
                        <div className='delete-btns'>
                            <button type='submit'>SIM</button>
                            <button type='submit'>NÃO</button>
                        </div>
                    </form>
                </div>
            </div>            
        )}
    </div>
  )
}

export default Exercicios