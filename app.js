const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const toursRouter = require('./routes/tours');
const usersRouter = require('./routes/users');
const RouteError = require('./routes/RouteError');
const { errorsController } = require('./controllers/errors');

process.loadEnvFile();

const app = express();

if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}
const rateLimiter = rateLimit({
  max: 60,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again later',
});
app.use(rateLimiter);

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

app.use((req, res, next) => {
  const error = new RouteError(`Route ${req.originalUrl} was not found`, 404);
  next(error);
});

app.use(errorsController);

module.exports = app;
