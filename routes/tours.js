const express = require('express');
const {
  getTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
} = require('../controllers/tours');

const router = express.Router();

router.route('/top-5-cheap').get(aliasTopTours, getTours);

router.route('/stats').get(getTourStats);

router.route('/').get(getTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
