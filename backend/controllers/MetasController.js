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


const getMeta = async(req, res) => {
    const { id_user } = req.params;

    try {
        const result = await pool.query('SELECT * FROM metas WHERE id_user = $1 ORDER BY id_meta DESC', [id_user]);

        if (result.rows.length === 0) {
            return res.status(200).json({success: true, data: [], message: "Nenhuma meta encontrada para esse usuário"})
        }

        return res.status(200).json({ success: true, data: result.rows, message: 'Metas encontradas' });
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