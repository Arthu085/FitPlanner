const express = require('express');
const { addUser, postLogin } = require('../controllers/LoginRegisterController');
const router = express.Router();

router.post('/registrar', addUser);
router.post('/logar', postLogin);

module.exports = router;