const pool = require('../config/dbConfig');

const getExercicios = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM exercises');
        res.status(200).json({ data: result.rows });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao obter clientes', error });
    };
};

module.exports = { getExercicios }