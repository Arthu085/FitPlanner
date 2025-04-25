const express = require('express');
const { getTreinos, addTreino, deleteTreino, editTreino } = require('../controllers/TreinosController');
const router = express.Router();

router.get('/gettreinos/:id_user', getTreinos);
router.post('/addtreino', addTreino);
router.delete('/deletetreino/:id_treino', deleteTreino);
router.put('/edittreino/:id_treino/:id_treino_exercicio?', editTreino);

module.exports = router;