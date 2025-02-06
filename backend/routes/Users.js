const express = require('express');
const { getUsers } = require('../controllers/UsersController');
const router = express.Router();

router.get('/getuser/:id_user', getUsers);

module.exports = router;