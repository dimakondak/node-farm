const express = require('express');

const {
  getTour,
  getOverview,
  getLogin,
  getAccount,
} = require('../controllers/views');

const { protect, isLoggedIn } = require('../controllers/authentication');

const router = express.Router();

router.route('/').get(isLoggedIn, getOverview);
router.route('/tours/:slug').get(isLoggedIn, getTour);
router.route('/login').get(isLoggedIn, getLogin);
router.route('/account').get(protect, getAccount);

module.exports = router;
