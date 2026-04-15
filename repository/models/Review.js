const mongoose = require('mongoose');
const TourModel = require('./Tour');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be blank'],
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
    created_at: { type: Date, default: Date.now(), select: false },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function () {
  this.populate({
    path: 'tour',
    select: 'name',
  }).populate({
    path: 'user',
    select: 'name photo',
  });
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.post(/^findOneAnd/, async function (review) {
  await Review.calculateAverageRatings(review.tour._id);
});

reviewSchema.post('save', async function () {
  await Review.calculateAverageRatings(this.tour);
});

reviewSchema.statics.calculateAverageRatings = async function (tourId) {
  const statisticsSet = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        reviewsQuantity: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);
  const statistics = statisticsSet[0];

  await TourModel.findByIdAndUpdate(tourId, {
    ratingQuantity: statistics.reviewsQuantity ?? 0,
    ratingAverage: statistics.averageRating ?? 0,
  });
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
