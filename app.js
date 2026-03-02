const express = require('express');
const morgan = require('morgan');
const toursRouter = require('./routes/tours');
const usersRouter = require('./routes/users');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.url);

    next();
});
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();

    next();
});

// Routes
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

app.get('/hello-world', (req, res) => {
    res.status(200).send('Hello World!');
});

module.exports = app;
