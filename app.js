const express = require('express');
const path = require('path');
const sequelize = require('./utils/database');

// Routes
const root = require('./routes/root');
const shortener = require('./routes/shortener');
const pwGen = require('./routes/pwGen');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/', root);
app.use('/api/url', shortener);
app.use('/api/passwordGenerator', pwGen);

// In case of an endpoint does not exist must return 404.html
// app.use((req, res, next) => { res.status(404).render('404.ejs', { pageTitle: '404' }) })

module.exports = app;