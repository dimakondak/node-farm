const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(
    `${__dirname}/../dev-data/data/tours-simple.json`).toString());

exports.checkId = (req, res, next, id) => {
    const tourIndex = tours.findIndex(
        tour => tour.id === parseInt(id));

    if (tourIndex === -1) {
        return res.status(404).json({
            status: 'fail', message: 'Tour not found',
        });
    }
    next();
};

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        requestedAt: req.requestTime,
        data: {
            tours,
        },
    });
};

exports.getTour = (req, res) => {
    console.log(req.params);
    const tour = tours.find(tour => tour.id === parseInt(req.params.id));

    if (!tour) {
        return res.status(404).json({
            status: 'fail', message: 'Tour not found',
        });
    }

    res.status(200).json({
        status: 'success', data: {
            tour: tour,
        },
    });
};

exports.createTour = (req, res) => {
    const newTour = req.body;
    const newId = tours[tours.length - 1].id + 1;
    const newTourObj = { id: newId, ...newTour };
    tours.push(newTourObj);

    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`,
        JSON.stringify(tours), (error) => {
            if (error) {
                res.status(500).send(error);
            }
            res.status(201).json({
                status: 'success', data: {
                    tour: newTourObj,
                },
            });
        });
};

exports.updateTour = (req, res) => {
    const tourIndex = tours.findIndex(
        tour => tour.id === parseInt(req.params.id));

    const patch = req.body;
    const newTourObj = { ...(tours[tourIndex]), ...patch };
    tours[tourIndex] = newTourObj;

    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`,
        JSON.stringify(tours), (error) => {
            if (error) {
                res.status(500).send(error);
            }
            res.status(201).json({
                status: 'success', data: {
                    tour: newTourObj,
                },
            });
        });
};

exports.deleteTour = (req, res) => {
    const tourIndex = tours.findIndex(
        tour => tour.id === parseInt(req.params.id));

    tours.splice(tourIndex, 1);

    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`,
        JSON.stringify(tours), (error) => {
            if (error) {
                return res.status(500).send(error);
            }
            res.status(204).json({
                status: 'success', data: null,
            });
        });
};