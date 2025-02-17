import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import SideBar from '../../components/SideBar/SideBar';
import { useEffect, useState } from 'react';
import './Metas.css';

const Metas = () => {
  const [formVisibleAdd, setFormVisibleAdd] = useState(false);
  const [metas, setMetas] = useState([]);
  const [filtro, setFiltro] = useState('todas');

  const userId = localStorage.getItem('id');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      alert('Faça login no sistema');
      navigate('/');
      localStorage.removeItem('id');
    }
  }, [userId, navigate]);

  useEffect(() => {
    // Simulação da requisição para buscar as metas do banco
    const fetchMetas = async () => {
      try {
        // Aqui você faria a requisição real para sua API
        // Exemplo: const response = await fetch('sua-api.com/metas');
        // const data = await response.json();
        
        // Simulando dados retornados do banco
        const metasDoBanco = [
          { id: 1, titulo: 'Treinar 5x por semana', descricao: 'Criar rotina consistente' },
          { id: 2, titulo: 'Ler 3 livros', descricao: 'Aprimorar conhecimento' },
          { id: 3, titulo: 'Melhorar alimentação', descricao: 'Manter dieta equilibrada' },
          { id: 5, titulo: 'Melhorar alimentação', descricao: 'Manter dieta equilibrada' },
          { id: 6, titulo: 'Melhorar alimentação', descricao: 'Manter dieta equilibrada' },
          { id: 7, titulo: 'Melhorar alimentação', descricao: 'Manter dieta equilibrada' },
          { id: 8, titulo: 'Melhorar alimentação', descricao: 'Manter dieta equilibrada' },
          { id: 9, titulo: 'Melhorar alimentação', descricao: 'Manter dieta equilibrada' },
          { id: 92, titulo: 'Melhorar alimentação', descricao: 'Manter dieta equilibrada' },
          { id: 93, titulo: 'Melhorar alimentação', descricao: 'Manter dieta equilibrada' },
          { id: 94, titulo: 'Melhorar alimentação', descricao: 'Manter dieta equilibrada' },
          { id: 95, titulo: 'Melhorar alimentação', descricao: 'Manter dieta equilibrada' },
          { id: 9, titulo: 'Melhorar alimentação', descricao: 'Manter dieta equilibrada' },
        ];

        // Adicionando a propriedade `concluida` localmente no frontend
        const metasCompletas = metasDoBanco.map(meta => ({
          ...meta,
          concluida: false, // Todas começam como não concluídas no frontend
        }));

        setMetas(metasCompletas);
      } catch (error) {
        console.error('Erro ao buscar metas:', error);
      }
    };

    fetchMetas();
  }, []);

  const toggleChecked = (id) => {
    setMetas((prevMetas) =>
      prevMetas.map((meta) =>
        meta.id === id ? { ...meta, concluida: !meta.concluida } : meta
      )
    );
  };

  const metasFiltradas = metas.filter((meta) => {
    if (filtro === 'concluidas') return meta.concluida;
    if (filtro === 'andamento') return !meta.concluida;
    return true;
  });

  return (
    <div className='sidebar-pages-container'>
      <NavigationBar />
      <SideBar />
      <div className="filtro-btn-container">
        <button className='btn-add-meta' onClick={() => setFormVisibleAdd(!formVisibleAdd)}>Adicionar Meta</button>
        <div className='filtros'>
          <label htmlFor="filtro">Filtrar metas:</label>
          <select id="filtro" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="todas">Todas</option>
            <option value="concluidas">Concluídas</option>
            <option value="andamento">Em Andamento</option>
          </select>
        </div>
      </div>

      <div className="metas-list">
        {metasFiltradas.length === 0 ? (
          <p className="no-metas-message">Nenhuma meta encontrada para o filtro selecionado.</p>
        ) : (
          metasFiltradas.map((meta) => (
            <div key={meta.id} className={`meta-content ${meta.concluida ? 'checked' : ''}`}>
              <h2>{meta.titulo}</h2>
              <div className='p-checkbox'>
                <p>{meta.descricao}</p>
                <input
                  type="checkbox"
                  checked={meta.concluida}
                  onChange={() => toggleChecked(meta.id)}
                />
              </div>
              <div className='span-datas'>
                <span>Data de criação:</span>
                <span>Previsão de finalização:</span>
              </div>
            </div>
          ))
        )}
      </div>

      {formVisibleAdd && (
        <div className='form-container'>
          <div className='form-overlay' onClick={() => setFormVisibleAdd(false)}></div>
          <div className='form-content'>
            <h2>Adicionar Meta</h2>
            <form className='form-add'>
              <label htmlFor="titulo">Título da Meta</label>
              <input type="text" placeholder='Digite o título da meta' required />
              <label htmlFor="descricao">Descrição da Meta</label>
              <textarea placeholder='Digite a descrição da meta' required />
              <label htmlFor="data">Data de Previsão</label>
              <input type="date" required />
              <button type='submit'>Adicionar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Metas;
