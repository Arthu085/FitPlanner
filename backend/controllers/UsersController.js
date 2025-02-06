const pool = require('../config/dbConfig');

const getUsers = async (req, res) => {
    const { id_user } = req.params;

    if (!id_user) {
        return res.status(400).json({ message: 'ID do usuário é obrigatório' });
    }

    try {
        const query = 'SELECT * FROM users WHERE id_user = $1';
        const result = await pool.query(query, [id_user]);

        if (!result.rows.length) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        return res.status(200).json({ data: result.rows[0] });
    } catch (error) {
        console.error('Erro ao encontrar usuário:', error);
        return res.status(500).json({ message: 'Erro interno no servidor', error });
    }
};

module.exports = { getUsers };
