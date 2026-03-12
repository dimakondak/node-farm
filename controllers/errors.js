exports.errorsController = (error, req, res) => {
  res.status(error.statusCode ?? 500).json({
    status: error.status || 'error',
    message: error.message || 'Internal Server Error',
  });
};
