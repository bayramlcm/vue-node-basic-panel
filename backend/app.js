const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const atom = require('./bin/atom')
const routes = require('./routes')

const app = express();

// Cors
app.use(cors()
)
// Debug
app.use(morgan('dev'));

// JSON
app.use(bodyParser.json());

// Veritabanı
mongoose.connect(    
    `mongodb://${atom.config.db.host}:${atom.config.db.port}/${atom.config.db.name}`,
    {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}
)

// Routelar
app.use('/', routes);

// Server RUN!
app.listen(3000, () => {
    console.log('Server run localhost:3000 !');
})