const crypto = require('crypto');
const mongoose = require('mongoose');
const { isEmail } = require('validator');
const { hash, compareSync } = require('bcrypt');
const { UserRole } = require('./UserRole');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A user must have a email'],
    validate: [isEmail, 'Please provide a valid email'],
    unique: [true, 'User with this email already exists'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    min: [8, 'A password must be between 8 and 16 characters'],
    max: [16, 'A password must be between 8 and 16 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm password'],
    validate: {
      validator: function (passwordConfirm) {
        // works only when new document creation (not when update/edit)
        return passwordConfirm === this.password;
      },
      message: 'Passwords do not match',
    },
    select: false,
  },
  photo: String,
  createdAt: { type: Date, default: Date.now(), select: false },
  passwordChangedAt: { type: Date, default: Date.now(), select: false },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  role: {
    type: String,
    required: true,
    enum: [...Object.values(UserRole)],
    default: UserRole.USER,
  },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.methods.isValidPassword = function (candidate) {
  return compareSync(candidate, this.password);
};

userSchema.methods.isTokenActual = function (tokenTimestamp) {
  const passwordChangedAtTimestamp = parseInt(
    this.passwordChangedAt.getTime() / 1000,
    10
  );
  return tokenTimestamp > passwordChangedAtTimestamp;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const tenMinutes = 10 * 60 * 1000;
  this.passwordResetExpires = Date.now() + tenMinutes;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
