const express = require('express');
const {
  updateCurrentUserProfile,
  deleteCurrentUser,
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/users');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  restrictTo,
  updatePassword,
} = require('../controllers/authentication');
const { UserRole } = require('../models/UserRole');

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword/:token').patch(resetPassword);

router.use(protect);
router.route('/updatePassword').patch(updatePassword);
router.route('/updateCurrentUser').patch(updateCurrentUserProfile);
router.route('/deleteCurrentUser').delete(deleteCurrentUser);
router
  .route('/')
  .get(getAllUsers)
  .post(restrictTo([UserRole.ADMIN]), createUser);
router
  .route('/:id')
  .get(getUser)
  .patch(restrictTo([UserRole.ADMIN]), updateUser)
  .delete(restrictTo([UserRole.ADMIN]), deleteUser);

module.exports = router;
