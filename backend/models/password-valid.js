const passwordValidation = require('password-validator');

// Schéma pour mot de passe
const schemaPassword = new passwordValidation();

// Déclaration des obligations pour sécurité password
schemaPassword
    // Longueur minimun 5 
    .is().min(5)
    // Doit avoir au moins une majuscule
    .has().uppercase()
    // Doit avoir au moins une minuscule
    .has().lowercase()
    // Doit avoir au moins un chiffre
    .has().digits()
    .is().not().oneOf(['Passw0rd', 'Password123']);

module.exports = schemaPassword;