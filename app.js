const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('@exortek/express-mongo-sanitize');
const { xss } = require('express-xss-sanitizer');
const hpp = require('hpp');
const path = require('path');

const toursRouter = require('./routes/tours');
const usersRouter = require('./routes/users');
const reviewsRouter = require('./routes/reviews');
const RouteError = require('./routes/RouteError');
const { errorsController } = require('./controllers/errors');

process.loadEnvFile();

const app = express();

/**
 * Configures SSR
 */
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
/**
 * Serves resources
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Sets security HTTP header
 */
app.use(helmet());

/**
 * Provides logs in dev mode
 */
if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

const rateLimiter = rateLimit({
  max: 60,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again later',
});
/**
 * Limits requests to 60 per hour per IP address
 */
app.use(rateLimiter);

/**
 * Used for body parsing, reading data from the body
 */
app.set('query parser', 'extended');
app.use(express.json({ limit: '10kb' }));

/**
 * Sanitizes data against NoSQL query injection
 */
app.use(mongoSanitize());

/**
 * Sanitizes data against XSS
 */
app.use(xss());

/**
 * Prevents parameter pollution
 */
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

/**
 * Records time of the request
 */
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

/**
 * Routes setup
 */
app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'TEST',
    user: {
      photo: 'photo.jpg',
      name: 'John Doe',
    },
  });
});

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewsRouter);

app.get('/hello-world', (req, res) => {
  res.status(200).send('Hello World!');
});

app.use((req, res, next) => {
  const error = new RouteError(`Route ${req.originalUrl} was not found`, 404);
  next(error);
});

app.use(errorsController);

module.exports = app;
