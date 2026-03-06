const TourModel = require('../models/Tour');

exports.getAllTours = (req, res) => {
  TourModel.find().then((tours) => {
    res.status(200).json({
      status: 'success',
      results: tours.length,
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
