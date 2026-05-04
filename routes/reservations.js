const express = require('express');
const {
  getCheckoutSession,
  createReservation,
  deleteReservation,
  updateReservation,
} = require('../controllers/reservations');
const { protect, restrictTo } = require('../controllers/authentication');
const { UserRole } = require('../UserRole');

const router = express.Router();

router.use(protect);
router
  .route('/checkout-session/:tourId')
  .get(getCheckoutSession)
  .post(restrictTo([UserRole.USER]), createReservation);
router
  .route('/:id')
  .delete(
    protect,
    restrictTo([UserRole.ADMIN, UserRole.USER]),
    deleteReservation
  )
  .put(restrictTo([UserRole.USER]), updateReservation);

module.exports = router;
