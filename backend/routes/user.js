// Mise en place d'Express
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// Créer 2 routes POST
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
