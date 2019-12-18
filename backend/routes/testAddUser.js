const express = require('express');

const atom = require('../bin/atom')

const app = express();

app.get('/', (req, res) => {
    const data = {
        name: 'Bayram ALAÇAM',
        username: 'bayramlcm',
        password: '12345678',
        permissions: {
            accountAdd: true,
            accountUpdate: true,
            accountDelete: true,
            accountGetAll: true,
        }
    };
    data.password = atom.createPassword(data.password);
    atom.models.users.create(data, (err, data) => {
        return res.json({
            err,
            data,
        });
    })
});

module.exports = app;