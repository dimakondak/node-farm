const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    created_at: { type: Date, default: Date.now(), select: false },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Reservation must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Reservation must belong to a user'],
    },
    price: {
      type: Number,
      required: [true, 'Reservation must have a price'],
    },
    paid: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reservationSchema.pre(/^find/, function () {
  this.populate({
    path: 'tour',
    select: 'name',
  }).populate({
    path: 'user',
    select: 'name',
  });
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
