// Importe le paquet express + body-parder + mongoose
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// Routes et models vers les sauces + utilisateurs
const Thing = require('./models/sauces');
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

// Parametres de sécurité
const helmet = require('helmet');
const nocache = require('nocache');
const session = require('cookie-session');

// Connexion à la base MongoDB
mongoose.connect('mongodb+srv://GaetanJund:12051997@sopekocko.xxtlc.mongodb.net/SoPekocko?retryWrites=true&w=majority', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Créer une application express
const app = express();

// Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, afin que tout le monde puisse faire des requetes depuis son navigateur
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
app.use(session({
  name: 'session',
  keys: ['key1', 'key2'],
  cookie: { secure: true,
            httpOnly: true,
            domain: 'http://localhost:4200',
            expires: expiryDate
          }
  })
);

// Rendre requête exploitable
app.use(bodyParser.urlencoded({
  extended: true
}));

// Utilisation de helmet (filtre de script) et enlever la mise en cache
app.use(helmet());
app.use(nocache());

// Gestionnaire de routage
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes vers utilisateurs
app.use('/api/auth', userRoutes);
// Routes vers produits
app.use('/api/sauces', saucesRoutes);

module.exports = app;