const express = require('express');
const {
  getReviews,
  createReview,
  deleteReview,
  updateReview,
} = require('../controllers/reviews');
const { protect, restrictTo } = require('../controllers/authentication');
const { UserRole } = require('../UserRole');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getReviews)
  .post(protect, restrictTo([UserRole.USER]), createReview);
router
  .route('/:id')
  .delete(protect, restrictTo([UserRole.ADMIN, UserRole.USER]), deleteReview)
  .put(protect, restrictTo([UserRole.USER]), updateReview);

module.exports = router;
