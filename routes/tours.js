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
const { protect } = require('../controllers/authentication');

const router = express.Router();

router.route('/top-5-cheap').get(aliasTopTours, getTours);

router.route('/stats').get(getTourStats);

router.use(protect);

router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(getTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
