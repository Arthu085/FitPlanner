const express = require('express');
const { addMeta } = require('../controllers/MetasController');
const router = express.Router();

router.post('/addmeta', addMeta);

module.exports = router;