// Importe express + appel router via express
const express = require('express');
const router = express.Router();

// Importe le controller + Sécuriser les routes
const sauceCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Route qui va créer une sauce
router.post('/', auth, multer, sauceCtrl.createSauce);
// Route qui va permetttre de modifier une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
// Route qui permet de supprimer une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);
// Route pour cliquer sur une sauce précise
router.get('/:id', auth, sauceCtrl.getOneSauce);
// Route pour récupérer toutes les sauces présentes
router.get('/', auth, sauceCtrl.getAllSauces);
// Route où l'on va gérer les likes
router.post('/:id/like', auth, sauceCtrl.likeAndDislike);

module.exports = router;