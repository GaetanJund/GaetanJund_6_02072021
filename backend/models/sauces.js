// Importer mongoose
const mongoose = require('mongoose');
// Appel de validation_file pour sécurité des champs de texte d'ajout d'une sauce


// Créer notre Schéma de données
// Passage en non-required les infos non présentes dans l'ajout d'une sauce
const sauceSchema = mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: false },
    dislikes: { type: Number, required: false },
    imageUrl: { type: String, required: true },
    mainPepper: { type: String, required: true },
    usersLiked: { type: [String], required: false },
    usersDisliked: { type: [String], required: false },
    userId: { type: String, required: false },
});

module.exports = mongoose.model('Sauce', sauceSchema);