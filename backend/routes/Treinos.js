const express = require('express');
const { getTreinos, addTreino } = require('../controllers/TreinosController');
const router = express.Router();

router.get('/gettreinos/:id_user', getTreinos);
router.post('/addtreino', addTreino);

module.exports = router;