// Importer le Thing
const Thing = require('../models/sauces');
const fs = require('fs');

// Thing = Sauce

// Crée une sauce dasn la base de donnée MongoDB
exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.sauce);
    delete thingObject._id;
    const thing = new Thing({
        ...thingObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDislikded: []
    });
    console.log(thing);
    thing.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

// Modifie une sauce de la base de donnée MongoDB
exports.modifyThing = (req, res, next) => {
    const thingObject = req.file ?
        {
            ...JSON.parse(req.body.thing),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

// Supprime une sauce de la base de donnée MongoDB
exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => {
            const filename = thing.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Thing.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

// Récupère une sauce de la base de donnée MongoDB
exports.getOneThing = (req, res, next) => {
    Thing.findOne({
        _id: req.params.id
    }).then(
        (thing) => {
            res.status(200).json(thing);
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
exports.getAllThings = (req, res, next) => {
    Thing.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }));
};

// Ajout des like/dislike + modification like/dislike
exports.likeAndDislike = (req, res, next) => {
    const like = req.body.like
    const userId = req.body.userId
    const sauceId = req.params.id

    if (like === 1) { // Pour ajouter un like
        Thing.updateOne({
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
        Thing.updateOne(
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
        Thing.findOne({
            _id: sauceId
        })
            .then((sauce) => {
                if (sauce.usersLiked.includes(userId)) { // Annuler un like et enleve -1 au compteur de like
                    Thing.updateOne({
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
                    Thing.updateOne({
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