const ReviewModel = require('../models/Review');
const { catchError } = require('./errors');
const ControllerError = require('./ControllerError');

exports.getReviews = catchError(async (req, res) => {
  const filter = req.body?.tourId && { tour: { $eq: req.body.tourId } };
  const reviews = await ReviewModel.find(filter);

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

  const review = await ReviewModel.create(newReviewPayload);

  res.status(201).json({
    status: 'success',
    data: { review },
  });
});

exports.deleteReview = catchError((req, res) => {
  ReviewModel.findByIdAndDelete(req.params.id).then(() => {
    res.status(204).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: null,
    });
  });
});
