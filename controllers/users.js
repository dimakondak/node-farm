const multer = require('multer');

const UserRepository = require('../repository/UserRepository');
const { catchError } = require('./errors');
const ControllerError = require('./ControllerError');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/img/users'),
  filename: (req, file, cb) => {
    const extension = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${extension}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image')) {
    return cb(new ControllerError('Not image', 400));
  }
  cb(null, true);
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadPhoto = upload.single('photo');

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
