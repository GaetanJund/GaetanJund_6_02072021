// Importer le Sauce
const Sauce = require('../models/sauces');
const fs = require('fs');

// Sauce = Sauce

// Crée une sauce dasn la base de donnée MongoDB
exports.createSauce = (req, res, next) => {
    const SauceObject = JSON.parse(req.body.sauce);
    delete SauceObject._id;
    const sauce = new Sauce({
        ...SauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDislikded: []
    });
    console.log(Sauce);
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

// Modifie une sauce de la base de donnée MongoDB
exports.modifySauce = (req, res, next) => {
    const SauceObject = req.file ?
        {
            ...JSON.parse(req.body.Sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...SauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

// Supprime une sauce de la base de donnée MongoDB
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(Sauce => {
            const filename = Sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

// Récupère une sauce de la base de donnée MongoDB
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (Sauce) => {
            res.status(200).json(Sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

// Récupère toutes les sauces de la base de donnéeMongoDB
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(Sauces => res.status(200).json(Sauces))
        .catch(error => res.status(400).json({ error }));
};

// Ajout des like/dislike + modification like/dislike
exports.likeAndDislike = (req, res, next) => {
    const like = req.body.like
    const userId = req.body.userId
    const sauceId = req.params.id

    if (like === 1) { // Pour ajouter un like
        Sauce.updateOne({
            _id: sauceId
        }, {
            // On sauvegarde utilisateur qui a liké et ajout +1 compteur de like
            $push: {
                usersLiked: userId
            },
            $inc: {
                likes: +1
            },
        })  // Envoi de l'info à la console
            .then(() => res.status(200).json({
                message: 'Sauce liké !'
            }))
            .catch((error) => res.status(400).json({
                error
            }))
    }
    if (like === -1) { // Pour dislike
        Sauce.updateOne(
            {
                _id: sauceId
            }, {
            // On sauvegarde utilisateur qui a disliké et ajout +1 compteur de dislike
            $push: {
                usersDisliked: userId
            },
            $inc: {
                dislikes: +1
            },
        }
        )   // Envoi de l'info à la console
            .then(() => {
                res.status(200).json({
                    message: 'Sauce Dislike !'
                })
            })
            .catch((error) => res.status(400).json({
                error
            }))
    }
    if (like === 0) { // Pour annuler un like/dislike
        Sauce.findOne({
            _id: sauceId
        })
            .then((sauce) => {
                if (sauce.usersLiked.includes(userId)) { // Annuler un like et enleve -1 au compteur de like
                    Sauce.updateOne({
                        _id: sauceId
                    }, {
                        $pull: {
                            usersLiked: userId
                        },
                        $inc: {
                            likes: -1
                        },
                    })
                        .then(() => res.status(200).json({
                            message: 'Like retiré pour cette sauce !'
                        }))
                        .catch((error) => res.status(400).json({
                            error
                        }))
                }
                if (sauce.usersDisliked.includes(userId)) { // Annuler un dislike et enleve -1 au compteur de dislike
                    Sauce.updateOne({
                        _id: sauceId
                    }, {
                        $pull: {
                            usersDisliked: userId
                        },
                        $inc: {
                            dislikes: -1
                        },
                    })
                        .then(() => res.status(200).json({
                            message: 'Dislike retiré pour cette sauce !'
                        }))
                        .catch((error) => res.status(400).json({
                            error
                        }))
                }
            })
            .catch((error) => res.status(404).json({
                error
            }))
    }
}