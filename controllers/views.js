const { catchError } = require('./errors');
const TourRepository = require('../repository/TourRepository');
const ReservationRepository = require('../repository/ReservationRepository');

exports.getOverview = catchError(async (req, res) => {
  const tours = await TourRepository.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchError(async (req, res) => {
  const slug = req.params.slug;
  const tour = await TourRepository.findTourBySlug(slug);

  res.status(200).render('tour', { tour });
});

exports.getMyReservations = catchError(async (req, res) => {
  const reservations = await ReservationRepository.findReservationsByUserId(
    req.user.id
  );

  const tourIDs = reservations.map(({ tour }) => tour.id);
  const tours = await TourRepository.findToursByIDs(tourIDs);

  res.status(200).render('overview', {
    title: 'Reserved Tours',
    tours,
  });
});

exports.getLogin = catchError(async (req, res) => {
  res.status(200).render('login', { title: 'Login' });
});

exports.getAccount = catchError(async (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
});
