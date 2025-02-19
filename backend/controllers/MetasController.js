const pool = require('../config/dbConfig');

const formatDateToISO = (dateBR) => {
    const [day, month, year] = dateBR.split('/');
    return `${year}-${month}-${day}`; // Converte para YYYY-MM-DD
};

const addMeta = async (req, res) => {
    let { id_user, titulo_meta, descricao_meta, data_finalizacao_meta } = req.body;

    try {
        // Converter data se estiver no formato brasileiro
        if (data_finalizacao_meta.includes('/')) {
            data_finalizacao_meta = formatDateToISO(data_finalizacao_meta);
        }

        const result = await pool.query(
            'INSERT INTO metas (id_user, titulo_meta, descricao_meta, data_finalizacao_meta, id_status) VALUES ($1, $2, $3, $4, 1) RETURNING *',
            [id_user, titulo_meta, descricao_meta, data_finalizacao_meta]
        );

        return res.status(201).json({ message: 'Meta criada com sucesso!', meta: result.rows[0] });
    } catch (error) {
        console.error('Erro no backend', error);
        return res.status(500).json({ error: 'Erro ao criar meta', details: error.message });
    }
};


const getMeta = async(req, res) => {
    const { id_user } = req.params;

    try {
        const result = await pool.query('SELECT * FROM metas WHERE id_user = $1 ORDER BY id_meta', [id_user]);

        return res.status(200).json({ message: 'Metas encontradas', meta: result.rows });
    } catch (error) {
        console.error('Erro no backend', error);
        return res.status(500).json({ error: 'Erro ao buscar meta', details: error.message });
    }
};

const editMeta = async(req, res) => {
    const { id_meta } = req.params;
    const { id_status } = req.body;

    try {
        const result = await pool.query('UPDATE metas SET id_status = $1 WHERE id_meta = $2 RETURNING *', [id_status, id_meta]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Meta não encontrada' });
        };

        res.status(200).json({ message: 'Meta editada com sucesso', data: result.rows[0] });
    } catch (error) {
        console.error('Erro ao editar meta:', error);
        res.status(500).json({ message: 'Erro interno no servidor', error: error.message });            
    }
};



module.exports = { addMeta, getMeta, editMeta }