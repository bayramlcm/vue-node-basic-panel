const md5 = require('md5')
const jwt = require('jsonwebtoken')

const config = require('./config')
const models = require('../models')

createToken = (data) => jwt.sign(data, config.secure.token);

checkToken = (token) => new Promise((resolve, reject) => {
    jwt.verify(token, config.secure.token, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
    });
});

createPassword = (data) => md5(md5(data) + config.secure.password);

module.exports = {
    config,
    models,
    createToken,
    checkToken,
    createPassword
}