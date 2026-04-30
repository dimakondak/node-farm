const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const TourRepository = require('../repository/TourRepository');
const { catchError } = require('./errors');
const ControllerError = require('./ControllerError');

exports.getCheckoutSession = catchError(async (req, res) => {
  const tourId = req.params?.tourId;

  const tour = await TourRepository.findById(tourId);

  if (!tour) {
    throw new ControllerError('No tour found', 404);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: `${tour.description}`,
        images: [],
        amount: tour.price * 100,
        currency: 'usd',
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

exports.createReservation = catchError(async (req, res) => {
  const newReviewPayload = {
    user: req.user.id,
    tour: req.params?.tourId,
    ...req.body,
  };

  const review = await TourRepository.create(newReviewPayload);

  res.status(201).json({
    status: 'success',
    data: { review },
  });
});

exports.updateReservation = catchError(async (req, res) => {
  const review = await TourRepository.updateById(req.params.id, req.body);

  res.status(201).json({
    status: 'success',
    data: { review },
  });
});

exports.deleteReservation = catchError(async (req, res) => {
  await TourRepository.deleteById(req.params.id);
  res.status(204).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: null,
  });
});
