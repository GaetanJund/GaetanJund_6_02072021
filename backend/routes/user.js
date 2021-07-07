// Mise en place d'Express + Importe le controller
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// Créer 2 routes POST

// Ajout de l'utilisateur dna sla base de donnée
router.post('/signup', userCtrl.signup);
// Connecte un utilisateur déjà inscrit
router.post('/login', userCtrl.login);

module.exports = router;