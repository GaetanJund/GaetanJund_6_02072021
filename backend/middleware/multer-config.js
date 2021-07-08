// Importe multer
const multer = require('multer');

// Preparation d'un dictionnaire
const MINE_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        // Eliminer les problèmes des 'espaces'
        const name = file.originalname.split('  ').join('_');
        // Applique une extension au fichier et générer un nom de fichier unique
        const extension = MINE_TYPES[file.minetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');