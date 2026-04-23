const { catchError } = require('./errors');
const TourRepository = require('../repository/TourRepository');

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

exports.getLogin = catchError(async (req, res) => {
  res.status(200).render('login', { title: 'Login' });
});
