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

const addExercicios = async (req, res) => {
    let { exercise_name } = req.body;

    try {
        // Converter para minúsculas para evitar duplicação com diferenças de caixa
        exercise_name = exercise_name.toLowerCase();

        // Verifica se já existe um exercício com esse nome
        const checkExistence = await pool.query(
            'SELECT * FROM exercises WHERE LOWER(exercise_name) = $1',
            [exercise_name]
        );

        if (checkExistence.rows.length > 0) {
            return res.status(400).json({ error: 'Esse exercício já existe!' });
        }

        // Se não existir, insere no banco
        const result = await pool.query(
            'INSERT INTO exercises (exercise_name) VALUES ($1) RETURNING *',
            [exercise_name]
        );

        return res.status(201).json({ message: 'Exercício criado com sucesso!', exercise: result.rows[0] });

    } catch (error) {
        console.error('Erro no backend', error);
        return res.status(500).json({ error: 'Erro ao criar exercício', details: error.message });
    }
};


module.exports = { getExercicios, addExercicios }