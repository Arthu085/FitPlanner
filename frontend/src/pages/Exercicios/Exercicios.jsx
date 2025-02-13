import React, { useEffect, useState } from 'react'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import SideBar from '../../components/SideBar/SideBar'
import { useNavigate } from 'react-router-dom'
import './Exercicios.css'

const Exercicios = () => {

    const [formVisibleAdd, setFormVisibleAdd] = useState(false);
    const [formVisibleEdit, setFormVisibleEdit] = useState(false);
    const [formVisibleDelete, setFormVisibleDelete] = useState(false);
    const [exercicios, setExercicios] = useState([]);
    const [exercise_name, setExerciseName] = useState("");
    const [id_exercise, setExercicioId] = useState(null);

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

      const toggleFormEdit = (id_exercise) => {
        setFormVisibleEdit(!formVisibleEdit);
        setExercicioId(id_exercise);
      };

      const toggleFormDelete = (id_exercise) => {
        setFormVisibleDelete(!formVisibleDelete);
        setExercicioId(id_exercise);
      };

    const getExercicios = async () => {
        try {
            const result = await fetch('http://localhost:3000/api/exercicios/getexercicios')
            const data = await result.json();

            if(result.ok) {
                setExercicios(data.data);
            } else {
                alert(`Erro ao buscar exercícios: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro ao buscar exercícios:', error);
            alert('Erro ao buscar exercícios')
        }
      };

      useEffect(() => {
        getExercicios();
      }, []);

    const addExercicio = async (event) => {
        event.preventDefault();

        if (!exercise_name || exercise_name.trim() === "") {
            alert("O nome do exercício não pode estar vazio.");
            return;
        }
        const exercicioData = { exercise_name };
    
        try {
            const result = await fetch('http://localhost:3000/api/exercicios/addexercicio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(exercicioData),
            });
    
            // Verifica se o status da resposta foi 'ok'
            if (result.ok) {
                const data = await result.json();  // Só processa a resposta se o status for ok
                alert(data.message);  // Mensagem de sucesso
                setFormVisibleAdd(!formVisibleAdd);
                await getExercicios();
                setExerciseName('');
            } else {
                const data = await result.json();  // Obtém o erro caso a resposta não seja ok
                alert(`Erro ao adicionar exercício: ${data.error || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error('Erro ao adicionar exercício:', error);
            alert('Erro ao adicionar exercício');
        }
    };

    const deleteExercicio = async (event) => {
        event.preventDefault();

        try {
            const result = await fetch(`http://localhost:3000/api/exercicios/deleteexercicio/${id_exercise}`, {
            method: 'DELETE',  
            });
            const data = await result.json();

            if(result.ok) {
                alert(data.message);
                getExercicios();
            } else {
                alert(`Erro: ${data.error}`);
            }
        } catch (err) {
            console.error('Erro ao deleter exercício', err);
            alert('Erro ao deletar exercício')
        }
        setFormVisibleDelete(!formVisibleDelete);
    };

    const editExercicio = async (event) => {
        event.preventDefault();

        if (!exercise_name || exercise_name.trim() === "") {
            alert("O nome do exercício não pode estar vazio.");
            return;
        }

        try {
            const result = await fetch(`http://localhost:3000/api/exercicios/editexercicio/${id_exercise}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ exercise_name })
            });
            const data = await result.json();
            
            if (result.status === 400) {
                alert(data.error);
                setExerciseName('');
                return;
            }

            if(result.ok) {
                alert(data.message);
                getExercicios();
                setExerciseName('');
            } else {
                alert(`Erro: ${data.error}`);
            }
        } catch (err) {
            console.error('Erro ao editar exercício', err);
            alert('Erro ao editar exercício')
        }
        setFormVisibleEdit(!formVisibleEdit);
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
            <ul>
                {exercicios.map((exercicios) => 
                <li key={exercicios.id_exercise}>
                        <span>{exercicios.exercise_name}</span>
                        <div className='edit-delete-btns'>
                            <button  onClick={() => toggleFormEdit(exercicios.id_exercise)}>Editar</button>
                            <button onClick={() => toggleFormDelete(exercicios.id_exercise)}>Excluir</button>
                        </div>
                </li>
                )}
            </ul>
            </div>
        </div>
        {formVisibleAdd && (
            <div className='form-container'>
            <div className='form-overlay' onClick={toggleFormAdd}></div>
                <div className='form-content'>
                    <h2>Adicionar Exercício</h2>
                    <form className='form-add-exercicio' onSubmit={addExercicio}>
                        <label htmlFor="name">Nome do Exercício</label>
                        <input type="text" placeholder='Digite o nome do exercício' value={exercise_name} onChange={(e) => setExerciseName(e.target.value)} required/>
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
                    <form className='form-add-exercicio' onSubmit={editExercicio}>
                        <label htmlFor="name">Nome novo do Exercício</label>
                        <input type="text" placeholder='Digite o novo nome do exercício' required value={exercise_name} onChange={(e) => setExerciseName(e.target.value)}/>
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
                            <button onClick={deleteExercicio}>SIM</button>
                            <button onClick={toggleFormDelete} >NÃO</button>
                        </div>
                    </form>
                </div>
            </div>            
        )}
    </div>
  )
}

export default Exercicios