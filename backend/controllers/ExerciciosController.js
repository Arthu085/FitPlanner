const pool = require('../config/dbConfig');

const getExercicios = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 8;
		const offset = (page - 1) * limit;

		const result = await pool.query(
			'SELECT * FROM exercises ORDER BY id_exercise LIMIT $1 OFFSET $2',
			[limit, offset]
		);

		const totalResult = await pool.query('SELECT COUNT(*) FROM exercises');
		const totalItems = parseInt(totalResult.rows[0].count);
		const totalPages = Math.ceil(totalItems / limit);

		res.status(200).json({
			data: result.rows,
			page,
			limit,
			totalItems,
			totalPages
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Erro ao obter exercícios', error });
	}
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

const deleteExercicio = async (req, res) => {
    const { id_exercise } = req.params;

    try {
        const query = 'DELETE FROM exercises WHERE id_exercise = $1 RETURNING *';
        const result = await pool.query(query, [id_exercise]);

        if(result.rows.length === 0) {
            return res.status(404).json({ error: 'Exercício não encontrado'});
        }

        res.status(200).json({ message: 'Exercício excluído com sucesso', data: result.rows[0] });
    } catch (err) {
        console.error('Erro ao excluir exercício', err);
        res.status(500).json({ message: 'Erro interno no servidor', err });        
    }
};

const editExercicio = async (req, res) => {
    const { id_exercise } = req.params;
    let { exercise_name } = req.body;

    try {
        exercise_name = exercise_name.toLowerCase();

        // Verifica se já existe um exercício com esse nome
        const checkExistence = await pool.query(
            'SELECT * FROM exercises WHERE LOWER(exercise_name) = $1',
            [exercise_name]
        );

        if (checkExistence.rows.length > 0) {
            return res.status(400).json({ error: 'Esse exercício já existe!' });
        }

        const query = `UPDATE exercises SET exercise_name = $1 WHERE id_exercise = $2 RETURNING *`;
        const result = await pool.query(query, [exercise_name, id_exercise]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Exercício não encontrado' });
        }

        res.status(200).json({ message: 'Exercício editado com sucesso', data: result.rows[0] });
    } catch (err) {
        console.error('Erro ao editar exercício:', err);
        res.status(500).json({ message: 'Erro interno no servidor', error: err.message });        
    }
};



module.exports = { getExercicios, addExercicios, deleteExercicio, editExercicio }