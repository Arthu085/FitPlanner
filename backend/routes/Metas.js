const express = require('express');
const { addMeta, getMeta, editMeta, getMetaFilter } = require('../controllers/MetasController');
const router = express.Router();

router.post('/addmeta', addMeta);
router.get('/getmeta/:id_user', getMeta);
router.put('/editmeta/:id_meta', editMeta);

module.exports = router;