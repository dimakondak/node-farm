const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { catchError } = require('./errors');
const ControllerError = require('./ControllerError');

exports.signup = catchError(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    photo: req.body.photo,
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
