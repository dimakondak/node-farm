const express = require('express');
const {
  getReviews,
  createReview,
  deleteReview,
} = require('../controllers/reviews');
const { protect, restrictTo } = require('../controllers/authentication');
const { UserRole } = require('../models/UserRole');

const router = express.Router();

router
  .route('/')
  .get(getReviews)
  .post(protect, restrictTo(UserRole.USER), createReview);
router.route('/:id').delete(protect, deleteReview);

module.exports = router;
