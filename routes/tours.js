const express = require('express');
const {
  getTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
} = require('../controllers/tours');
const reviewsRouter = require('./reviews');
const { protect, restrictTo } = require('../controllers/authentication');
const { UserRole } = require('../UserRole');

const router = express.Router();

router.route('/top-5-cheap').get(aliasTopTours, getTours);
router.route('/').get(getTours);

router.use(protect);
router.route('/stats').get(restrictTo([UserRole.ADMIN]), getTourStats);
router
  .route('/monthly-plan/:year')
  .get(restrictTo([UserRole.ADMIN]), getMonthlyPlan);
router
  .route('/tours-within/:distance/center/:coordinates/units/:units')
  .get(getToursWithin);
router
  .route('/')
  .post(restrictTo([UserRole.ADMIN, UserRole.LEAD_GUIDE]), createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(restrictTo([UserRole.ADMIN, UserRole.LEAD_GUIDE]), updateTour)
  .delete(restrictTo([UserRole.ADMIN, UserRole.LEAD_GUIDE]), deleteTour);
router.use('/:tourId/reviews', reviewsRouter);

module.exports = router;
