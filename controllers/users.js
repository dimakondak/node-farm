const multer = require('multer');
const sharp = require('sharp');

const UserRepository = require('../repository/UserRepository');
const { catchError } = require('./errors');
const ControllerError = require('./ControllerError');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image')) {
    return cb(new ControllerError('Not image', 400));
  }
  cb(null, true);
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadPhoto = upload.single('photo');

exports.resizeUserPhoto = catchError(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const extension = 'jpeg';
  req.file.filename = `user-${req.user.id}-${Date.now()}.${extension}`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat(extension)
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

exports.updateCurrentUserProfile = catchError(async (req, res) => {
  const profile = {
    name: req.body.name,
    email: req.body.email,
    ...(req.file ? { photo: req.file.filename } : {}),
  };
  const updatedUser = await UserRepository.updateById(req.user.id, profile);

  res.status(200).json({
    status: 'success',
    message: 'User profile was updated successfully',
    data: { user: updatedUser },
  });
});

exports.deleteCurrentUser = catchError(async (req, res) => {
  await UserRepository.updateById(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    message: 'User profile was deleted successfully',
  });
});

exports.getAllUsers = (req, res) => {
  UserRepository.find().then((users) => {
    res.status(200).json({
      status: 'success',
      results: users?.length ?? 0,
      requestedAt: req.requestTime,
      data: {
        users,
      },
    });
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented',
  });
};
