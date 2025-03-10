const express = require('express');
const { getTreinos, addTreino, deleteTreino } = require('../controllers/TreinosController');
const router = express.Router();

router.get('/gettreinos/:id_user', getTreinos);
router.post('/addtreino', addTreino);
router.delete('/deletetreino/:id_treino', deleteTreino);

module.exports = router;