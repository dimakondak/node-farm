const ReviewRepository = require('../repository/ReviewRepository');
const { catchError } = require('./errors');
const ControllerError = require('./ControllerError');

exports.getReviews = catchError(async (req, res) => {
  const tourId = req.params?.tourId ?? req.body?.tourId;
  const filter = tourId && { tour: { $eq: tourId } };

  const reviews = await ReviewRepository.find(filter);

  if (!reviews.length) {
    throw new ControllerError('No reviews found.', 404);
  }

  res.status(200).json({
    status: 'success',
    results: reviews?.length ?? 0,
    requestedAt: req.requestTime,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchError(async (req, res) => {
  const newReviewPayload = {
    user: req.user.id,
    tour: req.params?.tourId,
    ...req.body,
  };

  const review = await ReviewRepository.create(newReviewPayload);

  res.status(201).json({
    status: 'success',
    data: { review },
  });
});

exports.deleteReview = catchError(async (req, res) => {
  await ReviewRepository.deleteById(req.params.id);
  res.status(204).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: null,
  });
});
