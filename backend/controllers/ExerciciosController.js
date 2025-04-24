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

        if (result.rows.length === 0) {
            return res.status(200).json({success: true, data: [], message: "Nenhum exercício encontrado"})
        }

		res.status(200).json({
            success: true,
			data: result.rows,
			page,
			limit,
			totalItems,
			totalPages
		});
	} catch (error) {
        console.error('Erro ao encontrar exercícios:', error);
        return res.status(500).json({ success: false, message: 'Erro interno no servidor', error });
	}
};


const addExercicios = async (req, res) => {
    let { exercise_name } = req.body;

    try {
        // Converter para minúsculas para evitar duplicação com diferenças de caixa
        exercise_name = exercise_name.toLowerCase();

        if (!exercise_name || exercise_name.trim() === "") {
			return res.status(404).json({success: false,  message: "Nome do exercício não pode estar vazio"});
		}

        // Verifica se já existe um exercício com esse nome
        const checkExistence = await pool.query(
            'SELECT * FROM exercises WHERE LOWER(exercise_name) = $1',
            [exercise_name]
        );

        if (checkExistence.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Esse exercício já existe' });
        }

        // Se não existir, insere no banco
        const result = await pool.query(
            'INSERT INTO exercises (exercise_name) VALUES ($1) RETURNING *',
            [exercise_name]
        );

        return res.status(201).json({ success: true, message: 'Exercício criado com sucesso' });

    } catch (error) {
        console.error('Erro ao adicionar exercício:', error);
        return res.status(500).json({ success: false, message: 'Erro interno no servidor', error });
    }
};

const deleteExercicio = async (req, res) => {
    const { id_exercise } = req.params;

    try {
        const query = 'DELETE FROM exercises WHERE id_exercise = $1 RETURNING *';
        const result = await pool.query(query, [id_exercise]);

        if(result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Exercício não encontrado'});
        }

        res.status(200).json({ success:true, message: 'Exercício excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar exercício:', error);
        return res.status(500).json({ success: false, message: 'Erro interno no servidor', error });        
    }
};

const editExercicio = async (req, res) => {
    const { id_exercise } = req.params;
    let { exercise_name } = req.body;

    try {
        exercise_name = exercise_name.toLowerCase();

        if (!exercise_name || exercise_name.trim() === "") {
			return res.status(404).json({success: false,  message: "Nome do exercício não pode estar vazio"});
		}

        // Verifica se já existe um exercício com esse nome
        const checkExistence = await pool.query(
            'SELECT * FROM exercises WHERE LOWER(exercise_name) = $1',
            [exercise_name]
        );

        if (checkExistence.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Esse exercício já existe' });
        }

        const query = `UPDATE exercises SET exercise_name = $1 WHERE id_exercise = $2 RETURNING *`;
        const result = await pool.query(query, [exercise_name, id_exercise]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Exercício não encontrado' });
        }

        res.status(200).json({ success: true, message: 'Exercício editado com sucesso' });
    } catch (error) {
        console.error('Erro ao editar exercício:', error);
        return res.status(500).json({ success: false, message: 'Erro interno no servidor', error });           
    }
};



module.exports = { getExercicios, addExercicios, deleteExercicio, editExercicio }