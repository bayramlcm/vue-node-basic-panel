  
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const basename = path.basename(__filename);

fs.readdirSync(__dirname).filter(
    (file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'),
).forEach(
    (file) => app.use(`/${file.split('.')[0]}`, require(__dirname + path.sep + file)),
)

module.exports = app;