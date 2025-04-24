const pool = require('../config/dbConfig');

const getTreinos = async (req, res) => {
    const { id_user } = req.params;

    try {
        const query = 'SELECT a.id_user, a.id_treino, a.nome_treino, b.id_exercise, b.serie, b.repeticoes, c.exercise_name, b.id_treino_exercicio  FROM treinos a INNER JOIN treino_exercicio b ON a.id_treino = b.id_treino INNER JOIN exercises c ON b.id_exercise = c.id_exercise WHERE a.id_user = $1';
        const result = await pool.query(query, [id_user]);

		if (!result.rows.length) {
			return res.status(200).json({
				success: true,
				data: [],
				message: 'Nenhum treino cadastrado para este usuário',
			});
		}

        return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Erro ao encontrar treino:', error);
        return res.status(500).json({ success: false, message: 'Erro interno no servidor', error });
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

const editTreino = async (req, res) => {
    const { id_treino, id_treino_exercicio } = req.params;
    const { nome_treino, serie, repeticoes, id_exercise, adicionarExercicio, removerExercicio } = req.body;

    try {
        let treinoAtualizado = null;
        let exercicioAtualizado = null;

        // Atualiza o nome do treino se um novo nome for enviado
        if (nome_treino && nome_treino.trim() !== "") {
            const queryUpdateNome = 'UPDATE treinos SET nome_treino = $1 WHERE id_treino = $2 RETURNING *';
            const resultUpdateNome = await pool.query(queryUpdateNome, [nome_treino, id_treino]);

            if (resultUpdateNome.rows.length === 0) {
                return res.status(404).json({ error: 'Treino não encontrado' });
            }
            treinoAtualizado = resultUpdateNome.rows[0];
        }

        // Verifica se o id_treino_exercicio foi passado
        if (id_treino_exercicio) {
            const queryCheckExercicio = 'SELECT * FROM treino_exercicio WHERE id_treino_exercicio = $1';
            const resultCheckExercicio = await pool.query(queryCheckExercicio, [id_treino_exercicio]);

            if (resultCheckExercicio.rows.length === 0) {
                return res.status(404).json({ error: 'Exercício não encontrado' });
            }

            // Monta dinamicamente a query de UPDATE para atualizar apenas os campos enviados
            const fieldsToUpdate = [];
            const values = [];

            if (serie) {
                fieldsToUpdate.push(`serie = $${values.length + 1}`);
                values.push(serie);
            }
            if (repeticoes) {
                fieldsToUpdate.push(`repeticoes = $${values.length + 1}`);
                values.push(repeticoes);
            }
            if (id_exercise) {
                fieldsToUpdate.push(`id_exercise = $${values.length + 1}`);
                values.push(id_exercise);
            }

            // Atualiza os campos do exercício
            if (fieldsToUpdate.length > 0) {
                values.push(id_treino_exercicio);
                const queryUpdateExercicio = `
                    UPDATE treino_exercicio 
                    SET ${fieldsToUpdate.join(', ')}
                    WHERE id_treino_exercicio = $${values.length} 
                    RETURNING *;
                `;
                const resultUpdateExercicio = await pool.query(queryUpdateExercicio, values);
                exercicioAtualizado = resultUpdateExercicio.rows[0];
            }

            // Verifica e remove exercício, se for solicitado
            if (removerExercicio) {
                const queryRemoveExercicio = 'DELETE FROM treino_exercicio WHERE id_treino_exercicio = $1 RETURNING *';
                const resultRemoveExercicio = await pool.query(queryRemoveExercicio, [id_treino_exercicio]);

                if (resultRemoveExercicio.rows.length === 0) {
                    return res.status(404).json({ error: 'Exercício não encontrado para remoção' });
                }

                return res.status(200).json({
                    message: 'Exercício removido com sucesso',
                    exercicioRemovido: resultRemoveExercicio.rows[0]
                });
            }

            // Verifica e adiciona um novo exercício
            if (adicionarExercicio) {
                const { novoIdExercicio, novaSerie, novaRepeticao } = adicionarExercicio;

                if (!novoIdExercicio || !novaSerie || !novaRepeticao) {
                    return res.status(400).json({ error: 'Dados do novo exercício incompletos' });
                }

                const queryAddExercicio = `
                    INSERT INTO treino_exercicio (id_treino, id_exercise, serie, repeticoes)
                    VALUES ($1, $2, $3, $4) RETURNING *;
                `;
                const resultAddExercicio = await pool.query(queryAddExercicio, [id_treino, novoIdExercicio, novaSerie, novaRepeticao]);

                return res.status(200).json({
                    message: 'Exercício adicionado com sucesso',
                    novoExercicio: resultAddExercicio.rows[0]
                });
            }
        }

        return res.status(200).json({
            message: 'Atualização realizada com sucesso',
            treino: treinoAtualizado,
            exercicio: exercicioAtualizado
        });

    } catch (error) {
        console.error('Erro no backend', error);
        return res.status(500).json({ error: 'Erro ao editar treino', details: error.message });
    }
};

module.exports = { getTreinos, addTreino, deleteTreino, editTreino };