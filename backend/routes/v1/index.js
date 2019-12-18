
const express = require('express');
const path = require('path');
const fs = require('fs');

const atom = require('../../bin/atom')
const account = require('./account')

const app = express();

const basename = path.basename(__filename);


// Middleware
app.use((req, res, next) => {
    const { authorization: token } = req.headers;
    atom.checkToken(token).then(
        (decoded) => {
            const { _id } = decoded;
            atom.models.users.findOne({ _id, isDeleted: false }, (err, userResult) => {
                if (err) {
                    return res.json({
                        type: false,
                        data: null,
                        message: 'Sistemsel bir hata meydana geldi',
                    })
                }
                if (!userResult) {
                    return res.json({
                        type: false,
                        data: null,
                        message: 'Erişiminiz engellendi',
                    })
                }
                req.userData = userResult;
                next();
            });
        }
    ).catch(() => res.json({
        type: false,
        data: null,
        message: 'Erişiminiz engellendi',
    }));
});

app.use('/account', account);

fs.readdirSync(__dirname).filter(
    (file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'),
).forEach(
    (file) => app.use(`/${file.split('.')[0]}`, require(__dirname + path.sep + file)),
)

module.exports = app;