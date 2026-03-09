const TourModel = require('../models/Tour');

exports.getTours = async (req, res) => {
  const dbQuery = createDBQuery(req.query);

  const sortBy =
    (req.aliasQuery ? req.aliasQuery.sort : req.query.sort)
      ?.split(',')
      .join(' ') ?? '-createdAt';
  const fields =
    (req.aliasQuery ? req.aliasQuery.fields : req.query.fields)
      ?.split(',')
      .join(' ') ?? '-__v';

  const { limit, skipQuantity } = await preparePaginationProperties(
    req.query,
    dbQuery,
    req.aliasQuery
  );

  TourModel.find(dbQuery)
    .sort(sortBy)
    .select(fields)
    .skip(skipQuantity)
    .limit(limit)
    .then((tours) => {
      res.status(200).json({
        status: 'success',
        results: tours?.length ?? 0,
        requestedAt: req.requestTime,
        data: {
          tours,
        },
      });
    });
};

exports.getTour = (req, res) => {
  TourModel.findById(req.params.id)
    .then((tour) => {
      res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
          tour,
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

exports.createTour = (req, res) => {
  const newTourPayload = req.body;

  TourModel.create(newTourPayload)
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

exports.updateTour = (req, res) => {
  TourModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((tour) => {
      res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
          tour,
        },
      });
    })
    .catch(() => {
      res.status(404).json({
        status: 'fail',
        message: 'Failed to update tour',
      });
    });
};

exports.deleteTour = (req, res) => {
  TourModel.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: null,
      });
    })
    .catch(() => {
      res.status(404).json({
        status: 'fail',
        message: 'Failed to delete tour',
      });
    });
};

exports.aliasTopTours = (req, res, next) => {
  req.aliasQuery = {
    limit: '5',
    sort: '-ratingsAverage,price',
    fields: 'name,price,ratingsAverage,summary,difficulty',
  };
  next();
};

const createDBQuery = (requestQuery) => {
  const query = { ...requestQuery };
  const excluded = ['page', 'sort', 'limit', 'fields'];
  excluded.forEach((field) => delete query[field]);

  return JSON.parse(
    JSON.stringify(query).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    )
  );
};

const preparePaginationProperties = async (
  requestQuery,
  dbQuery,
  aliasQuery
) => {
  const page = +(aliasQuery ? aliasQuery.page : requestQuery.page) ?? 1;
  const limit = +(aliasQuery ? aliasQuery.limit : requestQuery.limit) ?? 10;
  const skipQuantity = (page - 1) * limit;

  if (requestQuery.page) {
    const numTours = await TourModel.countDocuments(dbQuery);
    if (skipQuantity >= numTours) throw new Error('This page does not exist');
  }
  return { limit, skipQuantity };
};
