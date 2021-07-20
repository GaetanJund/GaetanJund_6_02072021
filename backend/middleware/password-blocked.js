const rateLimit = require("express-rate-limit")

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 4,
    message: "Trop de tentatives de connexion. Compte bloqué pour 2 minutes"
});

module.exports = { limiter }