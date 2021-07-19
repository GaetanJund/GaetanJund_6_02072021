// Mise en place d'Express + Importe le controller
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// Importe la vérification du password
const verifPassword = require('../middleware/password-verif');

// Créer 2 routes POST

// Ajout de l'utilisateur dans la base de donnée
router.post('/signup', verifPassword, userCtrl.signup);
// Connecte un utilisateur déjà inscrit
router.post('/login', userCtrl.login);

module.exports = router;