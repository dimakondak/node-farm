const crypto = require('crypto');
const JWT = require('jsonwebtoken');
const UserModel = require('../models/User');
const { catchError } = require('./errors');
const ControllerError = require('./ControllerError');
const sendEmail = require('../services/email');

exports.signup = catchError(async (req, res) => {
  const { name, email, password, passwordConfirm, role, photo } = req.body;

  const newUser = await UserModel.create({
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

  const user = await UserModel.findOne({ email }).select('+password');
  if (!user || !user.isValidPassword(password)) {
    throw new ControllerError('Invalid email or password', 401);
  }

  const token = generateToken(user._id);
  res.cookie('jwt', token, createCookieOptions());

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: { ...user, password: undefined },
    },
  });
});

exports.forgotPassword = catchError(async (req, res) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email }).select('+password');
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

  const user = await UserModel.findOne({
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

exports.updatePassword = catchError(async (req, res) => {
  const { password, newPassword, newPasswordConfirm } = req.body;

  const user = await UserModel.findById(req.user.id).select('+password');

  if (!user || !password || !user.isValidPassword(password)) {
    throw new ControllerError('Invalid email or password', 401);
  }
  if (password === newPassword) {
    throw new ControllerError('Same password', 400);
  }
  if (newPassword !== newPasswordConfirm) {
    throw new ControllerError('Password mismatch', 400);
  }

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save({ validateBeforeSave: true });

  const token = generateToken(user._id);
  res.cookie('jwt', token, createCookieOptions());

  res.status(200).json({
    status: 'success',
    token,
    message: 'Password was updated successfully',
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
  const user = await UserModel.findById(id).select('+passwordChangedAt');

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

const createCookieOptions = () => {
  const cookiesExpirationMilliseconds =
    process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000;
  const isSecure = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isSecure,
    expires: new Date(Date.now() + cookiesExpirationMilliseconds),
  };
};
