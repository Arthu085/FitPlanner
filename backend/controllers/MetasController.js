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

module.exports = { addMeta }