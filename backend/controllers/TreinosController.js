const pool = require('../config/dbConfig');

const getTreinos = async (req, res) => {
    const { id_user } = req.params;

    try {
        const query = 'SELECT a.id_user, a.id_treino, a.nome_treino, b.id_exercise, b.serie, b.repeticoes, c.exercise_name  FROM treinos a INNER JOIN treino_exercicio b ON a.id_treino = b.id_treino INNER JOIN exercises c ON b.id_exercise = c.id_exercise WHERE a.id_user = $1';
        const result = await pool.query(query, [id_user]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro no backend', error);
        res.status(500).json({ error: 'Erro ao buscar treinos', details: error.message });
    };
};

const addTreino = async (req, res) => {
    const { nome_treino, id_user, exercicios } = req.body; 

    try {
        // Inserção do treino principal e captura do id_treino gerado
        const queryTreino = 'INSERT INTO treinos (nome_treino, id_user) VALUES ($1, $2) RETURNING id_treino';
        const resultTreino = await pool.query(queryTreino, [nome_treino, id_user]);

        // Verifique se o treino foi inserido corretamente
        if (resultTreino.rows.length > 0) {
            const id_treino = resultTreino.rows[0].id_treino; // Pega o id gerado do treino

            // Inserção dos exercícios, passando o id_treino para cada exercício
            const queriesExercicio = exercicios.map(exercicio => {
                const { id_exercise, serie, repeticoes } = exercicio;

                return pool.query(
                    'INSERT INTO treino_exercicio (id_treino, id_exercise, serie, repeticoes) VALUES ($1, $2, $3, $4)',
                    [id_treino, id_exercise, serie, repeticoes] // Passando 4 parâmetros
                );
            });

            // Aguarda todas as inserções de exercícios serem concluídas
            await Promise.all(queriesExercicio);

            res.status(201).json({ message: 'Treino e exercícios adicionados com sucesso' });
        } else {
            res.status(400).json({ message: 'Erro ao adicionar treino' });
        }
    } catch (error) {
        console.error('Erro no backend', error);
        res.status(500).json({ error: 'Erro ao adicionar treino', details: error.message });
    }
};

const deleteTreino = async (req, res) => {
    const { id_treino } = req.params;

    try {
        const query = 'DELETE FROM treinos WHERE id_treino = $1';
        const result = await pool.query(query, [id_treino]);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Treino excluído com sucesso' });
        } else {
            res.status(404).json({ message: 'Treino não encontrado' });
        }
    } catch (error) {
        console.error('Erro no backend', error);
        res.status(500).json({ error: 'Erro ao excluir treino', details: error.message });
    }
};

module.exports = { getTreinos, addTreino, deleteTreino };