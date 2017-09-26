const express = require('express');
const router = express.Router();
const auth = require('../dao/auth');
const knex = require('../../db/connection');

router.post('/register', auth.registerUser);

router.post('/login', auth.login);

router.get('/current_user', auth.checkAuthentication, auth.getCurrentUser);

module.exports = router;
