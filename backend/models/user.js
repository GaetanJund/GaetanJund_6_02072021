// Importer mongoose
const mongoose = require('mongoose');

// Rajout du plugin
const uniqueValidator = require('mongoose-unique-validator');

// Schéma pour l'utilisateur (stock l'email et password)
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Plugin pour email unique
userSchema.plugin(uniqueValidator);

// On exporte ce schéma sous forme de modèle
module.exports = mongoose.model('User', userSchema);