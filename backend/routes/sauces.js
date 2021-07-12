// Importe express + appel router via express
const express = require('express');
const router = express.Router();

// Importe le controller + Sécuriser les routes
const sauceCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Route qui va créer une sauce
router.post('/', auth, multer, sauceCtrl.createThing);
// Route qui va permetttre de modifier une sauce
router.put('/:id', auth, multer, sauceCtrl.modifyThing);
// Route qui permet de supprimer une sauce
router.delete('/:id', auth, sauceCtrl.deleteThing);
// Route pour cliquer sur une sauce précise
router.get('/:id', auth, sauceCtrl.getOneThing);
// Route pour récupérer toutes les sauces présentes
router.get('/', auth, sauceCtrl.getAllThings);
// Route où l'on va gérer les likes
router.post('/:id/like', auth, sauceCtrl.likeAndDislike);

module.exports = router;