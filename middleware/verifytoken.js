const jwt = require('jsonwebtoken');
const User = require('../model/User.js');

function auth(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) return res.status(401).send('Acess-Denied');
        const decoded = jwt.verify(token, "Bitnare");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(201).send('Authentication failed !');

    }
}




module.exports = auth;