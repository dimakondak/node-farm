const express = require('express');
const morgan = require('morgan');
const toursRouter = require('./routes/tours');
const usersRouter = require('./routes/users');

process.loadEnvFile();

const app = express();

if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'));
}
app.set('query parser', 'extended');
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
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
