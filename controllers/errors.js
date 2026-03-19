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
  handler(req, res, next).catch((error) => {
    if (
      error?.name === 'TokenExpiredError' ||
      error?.name === 'JsonWebTokenError'
    ) {
      const tokenError = new Error('Invalid or expired token');
      tokenError.isOperational = true;
      tokenError.status = 'fail';
      tokenError.statusCode = 401;

      return next(tokenError);
    }

    if (error?.name === 'ValidationError') {
      const validationError = new Error('Internal Server Error');
      validationError.isOperational = false;

      return next(validationError);
    }

    next(error);
  });
