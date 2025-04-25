const pool = require('../config/dbConfig');

const formatDateToISO = (dateBR) => {
    const [day, month, year] = dateBR.split('/');
    return `${year}-${month}-${day}`; // Converte para YYYY-MM-DD
};

const addMeta = async (req, res) => {
    let { id_user, titulo_meta, descricao_meta, data_finalizacao_meta } = req.body;

    if (!id_user || !titulo_meta || !descricao_meta || !data_finalizacao_meta) {
		return res.status(400).json({
			success: false,
			message: 'Todos os campos são obrigatórios'
		});
	}

    try {
        // Converter data se estiver no formato brasileiro
        if (data_finalizacao_meta.includes('/')) {
            data_finalizacao_meta = formatDateToISO(data_finalizacao_meta);
        }

        const result = await pool.query(
            'INSERT INTO metas (id_user, titulo_meta, descricao_meta, data_finalizacao_meta, id_status) VALUES ($1, $2, $3, $4, 1) RETURNING *',
            [id_user, titulo_meta, descricao_meta, data_finalizacao_meta]
        );

        return res.status(201).json({ success: true, message: 'Meta criada com sucesso' });
    } catch (error) {
        console.error('Erro ao adicionar meta:', error);
        return res.status(500).json({ success: false, message: 'Erro interno no servidor', error });
    }
};

const getMeta = async (req, res) => {
    const { id_user } = req.params; // id do usuário
    const { page = 1, limit = 12, filtro = 'todas' } = req.query; // Obtendo parâmetros de query (página, limite e filtro)
  
    const offset = (page - 1) * limit;
  
    let query = 'SELECT * FROM metas WHERE id_user = $1';
    let params = [id_user];
  
    // Lógica de filtragem
    if (filtro === 'concluidas') {
      query += ' AND id_status = 2'; // Filtra as metas concluídas
    } else if (filtro === 'andamento') {
      query += ' AND id_status = 1'; // Filtra as metas em andamento
    }
  
    query += ' ORDER BY id_meta DESC LIMIT $2 OFFSET $3'; // Ordena pela ID e aplica o limite e o offset
  
    params.push(limit, offset);
  
    try {
      // Executando a query para obter as metas com o filtro aplicado
      const result = await pool.query(query, params);
  
      // Query para contar o total de metas
      const totalCount = await pool.query(
        'SELECT COUNT(*) FROM metas WHERE id_user = $1' + (filtro !== 'todas' ? ` AND id_status = $2` : ''),
        filtro !== 'todas' ? [id_user, filtro === 'concluidas' ? 2 : 1] : [id_user]
      );
  
      // Respondendo com os dados
      return res.status(200).json({
        success: true,
        data: result.rows,
        message: 'Metas encontradas',
        total: parseInt(totalCount.rows[0].count), // Total de metas (considerando o filtro)
      });
    } catch (error) {
      console.error('Erro ao encontrar metas:', error);
      return res.status(500).json({ success: false, message: 'Erro interno no servidor', error });
    }
  };

const editMeta = async(req, res) => {
    const { id_meta } = req.params;
    const { id_status } = req.body;

    try {
        const result = await pool.query('UPDATE metas SET id_status = $1 WHERE id_meta = $2 RETURNING *', [id_status, id_meta]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Meta não encontrada' });
        };

        res.status(200).json({ success:true, message: 'Meta editada com sucesso' });
    } catch (error) {
        console.error('Erro ao editar meta:', error);
        return res.status(500).json({ success: false, message: 'Erro interno no servidor', error });          
    }
};



module.exports = { addMeta, getMeta, editMeta }