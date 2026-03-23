const crypto = require('crypto');
const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { catchError } = require('./errors');
const ControllerError = require('./ControllerError');
const sendEmail = require('../services/email');

exports.signup = catchError(async (req, res) => {
  const { name, email, password, passwordConfirm, role, photo } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
    photo,
  });

  if (!newUser) {
    throw new ControllerError('Failed to create user', 500);
  }

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

exports.login = catchError(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ControllerError('Failed to login', 500);
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.isValidPassword(password)) {
    throw new ControllerError('Invalid email or password', 401);
  }

  const token = generateToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
});

exports.forgotPassword = catchError(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ControllerError('There is no user with this email', 404);
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Reset it here: ${resetURL}\nIf you did not request a password reset, please ignore this email.`;
  sendEmail({
    email: user.email,
    subject: 'Password Reset Request',
    message,
  })
    .then(() => {
      res.status(200).json({
        status: 'success',
        message: 'Password reset email sent',
      });
    })
    .catch(async () => {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save({ validateBeforeSave: false });

      throw new ControllerError('Failed to send email', 500);
    });
});

exports.resetPassword = catchError(async (req, res) => {
  const { token } = req.params;
  const { password, passwordConfirm } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new ControllerError('Token is invalid or expired', 400);
  }

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save({ validateBeforeSave: true });

  res.status(200).json({
    status: 'success',
    message: 'Password reset successful',
  });
});

exports.protect = catchError(async (req, res, next) => {
  const isTokenAbsent =
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer');

  if (isTokenAbsent) {
    throw new ControllerError('Unauthorized', 401);
  }

  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    throw new ControllerError('Unauthorized', 401);
  }

  const { id, iat } = JWT.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(id).select('+passwordChangedAt');

  if (!user) {
    throw new ControllerError('Profile does not exist', 401);
  }

  if (!user.isTokenActual(iat)) {
    throw new ControllerError('Token expired', 401);
  }

  req.user = user;
  next();
});

exports.restrictTo = (roles) =>
  catchError(async (req, res, next) => {
    if (!roles.includes(req?.user?.role)) {
      throw new ControllerError('Access denied', 403);
    }
    next();
  });

const generateToken = (id) =>
  JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
