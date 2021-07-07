// Importe le paquet express + body-parder + mongoose
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Routes et models vers les sauces + utilisateurs
const Thing = require('./models/sauces');
const userRoutes = require('./routes/user');

// Créer une application express
const app = express();

// Connexion à la base MongoDB
mongoose.connect('mongodb+srv://GaetanJund:12051997@sopekocko.xxtlc.mongodb.net/SoPekocko?retryWrites=true&w=majority', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, afin que tout le monde puisse faire des requetes depuis son navigateur
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.post('/api/sauces', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: 'Objet créé !'
  });
});

app.use(bodyParser.json());

app.post('/api/sauces', (req, res, next) => {
  delete req.body._id;
  const thing = new Thing({
    ...req.body
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré' }))
    .catch(error => res.status(401).json({ error }));
});

// Routes vers utilisateurs
app.use('/api/auth', userRoutes);

module.exports = app;