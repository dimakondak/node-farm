const express = require('express');

const { getTour, getOverview } = require('../controllers/views');

const { protect, restrictTo } = require('../controllers/authentication');
const { UserRole } = require('../UserRole');

const router = express.Router();

router.route('/').get(getOverview);
router.route('/tours/:slug').get(getTour);

module.exports = router;
