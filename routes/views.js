const express = require('express');

const {
  getTour,
  getOverview,
  getLogin,
  getAccount,
  getMyReservations,
} = require('../controllers/views');
const { createReservation } = require('../controllers/reservations');

const { protect, isLoggedIn } = require('../controllers/authentication');

const router = express.Router();

router.route('/').get(isLoggedIn, getOverview);
router.route('/tours/:slug').get(isLoggedIn, getTour);
router.route('/login').get(isLoggedIn, getLogin);
router.route('/account').get(protect, getAccount);
router
  .route('/my-reservations')
  .get(protect, createReservation, getMyReservations);

module.exports = router;
