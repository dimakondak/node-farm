const express = require('express');

const { getTour, getOverview, getLogin } = require('../controllers/views');

const { protect, isLoggedIn } = require('../controllers/authentication');

const router = express.Router();

router.use(isLoggedIn);
router.route('/').get(getOverview);
router.route('/tours/:slug').get(getTour);
router.route('/login').get(getLogin);

module.exports = router;
