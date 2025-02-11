const express = require('express');
const { getExercicios } = require('../controllers/ExerciciosController');
const router = express.Router();

router.get('/getexercicios', getExercicios);

module.exports = router;