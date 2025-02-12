const express = require('express');
const { getExercicios, addExercicios } = require('../controllers/ExerciciosController');
const router = express.Router();

router.get('/getexercicios', getExercicios);
router.post('/addexercicio', addExercicios);

module.exports = router;