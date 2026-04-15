const UserRepository = require('../repository/UserRepository');
const { catchError } = require('./errors');

exports.updateCurrentUserProfile = catchError(async (req, res) => {
  const profile = {
    name: req.body.name,
    email: req.body.email,
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
