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
} = require('../controllers/tours');
const reviewsRouter = require('./reviews');
const { protect, restrictTo } = require('../controllers/authentication');
const { UserRole } = require('../UserRole');

const router = express.Router();

router.route('/top-5-cheap').get(aliasTopTours, getTours);
router.route('/stats').get(getTourStats);

router.use(protect);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router
  .route('/')
  .get(getTours)
  .post(restrictTo([UserRole.ADMIN, UserRole.GUIDE]), createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(restrictTo([UserRole.ADMIN, UserRole.GUIDE]), updateTour)
  .delete(restrictTo([UserRole.ADMIN, UserRole.GUIDE]), deleteTour);
router.use('/:tourId/reviews', reviewsRouter);

module.exports = router;
