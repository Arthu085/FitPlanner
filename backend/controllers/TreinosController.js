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

    const client = await pool.connect(); // Conectar ao banco

    try {
        await client.query('BEGIN'); // Iniciar transação

        // Inserir o treino e capturar o ID gerado
        const queryTreino = 'INSERT INTO treinos (nome_treino, id_user) VALUES ($1, $2) RETURNING id_treino';
        const resultTreino = await client.query(queryTreino, [nome_treino, id_user]);

        if (resultTreino.rows.length === 0) {
            throw new Error('Erro ao adicionar treino');
        }

        const id_treino = resultTreino.rows[0].id_treino;

        for (const exercicio of exercicios) {
            const { id_exercise, serie, repeticoes } = exercicio;

            // Verificar se o exercício já existe nesse treino
            const checkQuery = 'SELECT 1 FROM treino_exercicio WHERE id_treino = $1 AND id_exercise = $2';
            const checkResult = await client.query(checkQuery, [id_treino, id_exercise]);

            if (checkResult.rows.length > 0) {
                await client.query('ROLLBACK'); // Cancela a transação
                return res.status(400).json({ 
                    error: `O exercício já está cadastrado neste treino!` 
                });
            }

            // Inserir exercício se não existir
            await client.query(
                'INSERT INTO treino_exercicio (id_treino, id_exercise, serie, repeticoes) VALUES ($1, $2, $3, $4)',
                [id_treino, id_exercise, serie, repeticoes]
            );
        }

        await client.query('COMMIT'); // Confirma a transação

        res.status(201).json({ message: 'Treino e exercícios adicionados com sucesso' });
    } catch (error) {
        await client.query('ROLLBACK'); // Desfaz tudo se houver erro
        console.error('Erro no backend:', error);
        res.status(400).json({ error: 'Erro ao adicionar treino', details: error.message });
    } finally {
        client.release(); // Libera a conexão do pool
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