const pool = require('../config/dbConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

const JWT_SECRET = '2025'; 

const register = async (req, res) => {
    const { email_user, password_user, name_user, lastname_user } = req.body;

    const trimmedEmail = email_user.trim();
    const trimmedPassword = password_user.trim();
    const trimmedName = name_user.trim();
    const trimmedLastName = lastname_user.trim();

    if (!trimmedEmail || !trimmedPassword || !trimmedName || !trimmedLastName) {
        return res.status(400).json({ success: false, message: 'Preencha todos os campos' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
        return res.status(400).json({ success: false, message: 'Digite um e-mail válido' });
    }
    
    if (trimmedPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'Mínimo de 6 caracteres' });
    }

    try {
        // Verificar se o e-mail já existe
        const result = await pool.query('SELECT * FROM users WHERE email_user = $1', [email_user]);

        // Verificar se o resultado da consulta está correto
        if (result && result.rows && result.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'E-mail já cadastrado' });
        }

        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(password_user, 10);

        // Inserir o novo usuário no banco
        const insertResult = await pool.query(
            'INSERT INTO users (email_user, password_user, name_user, lastname_user) VALUES ($1, $2, $3, $4) RETURNING *', 
            [email_user, hashedPassword, name_user, lastname_user]
        );

        // Verificar se a inserção foi bem-sucedida
        if (insertResult && insertResult.rows && insertResult.rows.length > 0) {
            const { password_user: removedPassword, ...userData } = insertResult.rows[0]; // Remover a senha
            return res.status(201).json({ success: true, message: 'Usuário criado com sucesso', usuario: userData });
        } else {
            return res.status(500).json({ success: false, message: 'Erro ao inserir usuário' });
        }

    } catch (error) {
        console.error('Erro no backend', error);
        return res.status(500).json({ success: false, message: 'Erro ao criar usuário', details: error.message });
    }
};

const login = async (req, res) => {
	const { email_user, password_user } = req.body;

	if (!email_user?.trim() || !password_user?.trim()) {
		return res.status(400).json({ success: false, message: 'E-mail e senha são obrigatórios' });
	}

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_user)) {
        return res.status(400).json({ success: false, message: 'Digite um e-mail válido' });
    }

	try {
		const user = await pool.query('SELECT * FROM users WHERE email_user = $1', [email_user]);

		if (!user.rows.length) {
			return res.status(401).json({ success: false, message: 'E-mail ou senha inválidos' });
		}

		const usuario = user.rows[0];
		const match = await bcrypt.compare(password_user, usuario.password_user);

		if (!match) {
			return res.status(401).json({ success: false, message: 'E-mail ou senha inválidos' });
		}

		const token = jwt.sign({ userId: usuario.id_user }, JWT_SECRET, { expiresIn: '1h' });

		res.status(200).json({
			success: true,
			message: 'Login bem-sucedido',
			token,
			id_user: usuario.id_user
		});
	} catch (error) {
		console.error('Erro ao fazer login do usuário:', email_user, error);
		res.status(500).json({ success: false, message: 'Erro interno no servidor' });
	}
};

module.exports = { register, login };
