const path = require('path');
const fs = require('fs');

const basename = path.basename(__filename);

const models = {};

fs.readdirSync(__dirname).filter(
    (file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
).forEach(
    (file) => models[file.split('.')[0]] = require(__dirname + path.sep + file)
);

module.exports = models;