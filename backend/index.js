require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Importar Rotas
const LoginRegisterRoutes = require('./routes/LoginRegister');
const UsersRoutes = require('./routes/Users');
const ExerciciosRoutes = require('./routes/Exercicios');

// Configurações do servidor
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Rotas
app.use('/api/loginregister', LoginRegisterRoutes);
app.use('/api/user', UsersRoutes);
app.use('/api/exercicios', ExerciciosRoutes);



// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});