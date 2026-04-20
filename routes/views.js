const express = require('express');

const { getBase, getOverview } = require('../controllers/views');

const { protect, restrictTo } = require('../controllers/authentication');
const { UserRole } = require('../UserRole');

const router = express.Router();

router.route('/').get(getOverview);

module.exports = router;
