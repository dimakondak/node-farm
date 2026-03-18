const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { catchError } = require('./errors');
const ControllerError = require('./ControllerError');

process.loadEnvFile();

exports.signup = catchError(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
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

const generateToken = (id) =>
  JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
