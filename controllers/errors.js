process.loadEnvFile();

exports.errorsController = (error, req, res, next) => {
  if (!error.isOperational)
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });

  if (process.env.NODE_ENV === 'dev') {
    return res.status(error.statusCode ?? 500).json({
      status: error.status || 'error',
      message: error.message || 'Internal Server Error',
      error,
      stack: error.stack,
    });
  }

  res.status(error.statusCode ?? 500).json({
    status: error.status || 'error',
    message: error.message || 'Internal Server Error',
  });

  next(error);
};

exports.catchError = (handler) => async (req, res, next) =>
  handler(req, res, next).catch(next);
