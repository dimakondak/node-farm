const TourModel = require('../models/Tour');

exports.getTours = async (req, res) => {
  const query = { ...req.query };
  const excluded = ['page', 'sort', 'limit', 'fields'];
  excluded.forEach((field) => delete query[field]);

  const filterQuery = JSON.parse(
    JSON.stringify(query).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    )
  );

  const sortBy = req.query.sort?.split(',').join(' ') ?? '-createdAt';
  const page = +req.query.page ?? 1;
  const limit = +req.query.limit ?? 10;
  const skip = (page - 1) * limit;

  if (req.query.page) {
    const numTours = await TourModel.countDocuments(filterQuery);
    if (skip >= numTours) throw new Error('This page does not exist');
  }

  TourModel.find(filterQuery)
    .sort(sortBy)
    .select(req.query.fields?.split(',').join(' ') ?? '-__v')
    .skip(skip)
    .limit(limit)
    .then((tours) => {
      res.status(200).json({
        status: 'success',
        results: tours.length,
        requestedAt: req.requestTime,
        data: {
          tours,
        },
      });

      return tours;
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
