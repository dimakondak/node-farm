const { catchError } = require('./errors');
const TourRepository = require('../repository/TourRepository');

exports.getOverview = catchError(async (req, res) => {
  const tours = await TourRepository.find();
  console.log(tours[0]);
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});
