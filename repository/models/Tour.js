const mongoose = require('mongoose');
const slugify = require('slugify');
const { isAlpha } = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must have less or equal then 40 characters'],
      minLength: [10, 'A tour name must have more or equal then 10 characters'],
      validate: [
        (value) => isAlpha(value.replace(/ /g, '')),
        'Tour name must only contain letters',
      ],
    },
    slug: String,
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    duration: { type: Number, required: [true, 'A tour must have a duration'] },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    price: { type: Number, required: [true, 'A tour must have a price'] },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (discount) {
          // works only when new document creation (not when update/edit)
          return discount < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A tour must have a rating between 1 and 5'],
      max: [5, 'A tour must have a rating between 1 and 5'],
    },
    ratingQuantity: { type: Number, default: 0 },
    summary: { type: String, trim: true },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: { type: Date, default: Date.now(), select: false },
    startDates: [Date],
    secretTour: { type: Boolean, default: false },
    /**
     * GeoJSON
     */
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    location: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: -1, ratingAverage: 1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

/**
 * The virtual population
 */
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

/**
 * Middleware to handle pre-save operations. Runs only before .save() and .create()
 * does NOT run before .insertMany()
 */
tourSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
});

tourSchema.pre('save', function () {
  console.log('Saving tour');
});

tourSchema.post('save', async function (tour) {
  console.log('Tour was saved', tour);
});

/**
 * Middleware to handle ALL pre-find operations. Runs before .find(), .findOne(), etc.
 * this represents the query object
 */
tourSchema.pre(/^find/, function () {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
});

tourSchema.pre(/^find/, function () {
  this.populate({
    path: 'guides',
    select: '-__v',
  });
});

tourSchema.post(/^find/, function (tours) {
  console.log(
    `Found ${tours?.length ?? 0} tours in ${Date.now() - this.start}ms`
  );
});

tourSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
