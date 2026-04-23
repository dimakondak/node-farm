const TourRepository = require('../repository/TourRepository');
const { catchError } = require('./errors');
const ControllerError = require('./ControllerError');

exports.getTours = catchError(async (req, res) => {
  const sort =
    (req.aliasQuery ? req.aliasQuery.sort : req.query.sort)
      ?.split(',')
      .join(' ') ?? '-createdAt';
  const select =
    (req.aliasQuery ? req.aliasQuery.fields : req.query.fields)
      ?.split(',')
      .join(' ') ?? '-__v';

  const page = +(req.aliasQuery?.page ?? req.query.page ?? 1);
  const limit = +(req.aliasQuery?.limit ?? req.query.limit ?? 10);
  const filter = convertQueryToFilter(req.query);

  const skip = await TourRepository.countToursToSkip(filter, page, limit);
  const tours = await TourRepository.find(filter, {
    sort,
    select,
    skip,
    limit,
  });

  res.status(200).json({
    status: 'success',
    results: tours?.length ?? 0,
    requestedAt: req.requestTime,
    data: {
      tours,
    },
  });
});

exports.getTour = catchError(async (req, res) => {
  const tour = await TourRepository.findById(req.params.id, {
    populate: { path: 'reviews', select: '-tour' },
  });

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      tour,
    },
  });
});

exports.createTour = (req, res) => {
  const newTourPayload = req.body;

  TourRepository.create(newTourPayload)
    .then((newTour) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 'fail',
        message: error.message,
      });
    });
};

exports.updateTour = catchError(async (req, res) => {
  const tour = await TourRepository.updateById(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchError(async (req, res) => {
  await TourRepository.deleteById(req.params.id);
  res.status(204).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: null,
  });
});

exports.aliasTopTours = (req, res, next) => {
  req.aliasQuery = {
    limit: '5',
    sort: '-ratingsAverage,price',
    fields: 'name,price,ratingsAverage,summary,difficulty',
  };
  next();
};

exports.getTourStats = (req, res) => {
  TourRepository.prepareStatistics()
    .then((stats) => {
      res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
          stats,
        },
      });
    })
    .catch(() => {
      res.status(404).json({
        status: 'fail',
        message: 'Failed to prepare stats',
      });
    });
};

exports.getMonthlyPlan = (req, res) => {
  const year = +req.params.year;

  TourRepository.prepareMonthlyPlan(year)
    .then((plan) => {
      res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
          plan,
        },
      });
    })
    .catch(() => {
      res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    });
};

exports.getToursWithin = catchError(async (req, res) => {
  const { distance, coordinates, units } = req.params;
  const [latitude, longitude] = coordinates.split(',');

  if (!latitude || !longitude) {
    throw ControllerError('Please specify a latitude and longitude', 400);
  }

  const tours = await TourRepository.findToursWithin(
    longitude,
    latitude,
    distance,
    units
  );

  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedAt: req.requestTime,
    data: { tours },
  });
});

exports.getDistances = catchError(async (req, res) => {
  const { coordinates, units } = req.params;
  const [latitude, longitude] = coordinates.split(',');

  if (!latitude || !longitude) {
    throw ControllerError('Please specify a latitude and longitude', 400);
  }

  const distances = await TourRepository.findDistances(
    longitude,
    latitude,
    units
  );

  res.status(200).json({
    status: 'success',
    results: distances.length,
    requestedAt: req.requestTime,
    data: { distances },
  });
});

const convertQueryToFilter = (requestQuery) => {
  const query = { ...requestQuery };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((field) => delete query[field]);

  // Handle advanced filtering operators (gte, gt, lte, lt) by adding '$' prefix
  const queryStr = JSON.stringify(query).replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );

  return JSON.parse(queryStr);
};
