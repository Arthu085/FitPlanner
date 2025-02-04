require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Importar Rotas
const LoginRegisterRoutes = require('./routes/LoginRegister');

// Configurações do servidor
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Rotas
app.use('/api/loginregister', LoginRegisterRoutes);


// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});