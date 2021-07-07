// Importer bcrypt
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


// Enregistrements de nouveau utilisateurs
exports.signup = (req, res, next) => {
    // fonction crypter un mot de passe
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // Création d'un nouvel User
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // Enregistrer l'utilisateur dans la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur crée !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Connexté des utilisateurs existants
exports.login = (req, res, next) => {
    // Récupère l'utilisateur de la base de données via son email
    User.findOne({ email: req.body.email })
        .then(user => {
            // Si on a pas trouvé de user
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // Compare le mot de passe entré avec elui présent dans la base de donnée
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // Si mot de passe n'est pas bon, on renvoi un message
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};