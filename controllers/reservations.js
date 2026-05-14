const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const TourRepository = require('../repository/TourRepository');
const ReservationRepository = require('../repository/ReservationRepository');
const { catchError } = require('./errors');
const ControllerError = require('./ControllerError');

exports.getCheckoutSession = catchError(async (req, res) => {
  const tourId = req.params?.tourId;

  const tour = await TourRepository.findById(tourId);

  if (!tour) {
    throw new ControllerError('No tour found', 404);
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],

    success_url: `${req.protocol}://${req.get('host')}/my-reservations?tour=${tourId}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,

    customer_email: req.user.email,
    client_reference_id: req.params.tourId,

    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: `${tour.description}`,
            images: [],
          },
        },
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    session,
  });
});

exports.createReservation = catchError(async (req, res, next) => {
  if (!req.query.tour) {
    return next();
  }

  const payload = {
    user: req.user.id,
    tour: req.query.tour,
    price: req.query.price,
    paid: req.query.paid ?? true,
  };
  await ReservationRepository.create(payload);

  next();
});

exports.updateReservation = catchError(async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented',
  });
});

exports.deleteReservation = catchError(async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented',
  });
});
