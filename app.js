const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server running on port:', port);
});

app.get('/hello-world', (req, res) => {
    res.status(200).send('Hello World!');
});

const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success', results: tours.length, data: {
            tours,
        },
    });
};

const getTour = (req, res) => {
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

const createTour = (req, res) => {
    const newTour = req.body;
    const newId = tours[tours.length - 1].id + 1;
    const newTourObj = { id: newId, ...newTour };
    tours.push(newTourObj);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,
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

const updateTour = (req, res) => {
    const tourIndex = tours.findIndex(
        tour => tour.id === parseInt(req.params.id));
    if (tourIndex === -1) {
        return res.status(404).json({
            status: 'fail', message: 'Tour not found',
        });
    }

    const patch = req.body;
    const newTourObj = { ...(tours[tourIndex]), ...patch };
    tours[tourIndex] = newTourObj;

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,
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

const deleteTour = (req, res) => {
    const tourIndex = tours.findIndex(
        tour => tour.id === parseInt(req.params.id));

    if (tourIndex === -1) {
        return res.status(404).json({
            status: 'fail', message: 'Tour not found',
        });
    }

    tours.splice(tourIndex, 1);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours), (error) => {
            if (error) {
                return res.status(500).send(error);
            }
            res.status(204).json({
                status: 'success', data: null,
            });
        });
};

const tours = JSON.parse(fs.readFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`).toString());

app.route('/api/v1/tours')
.get(getAllTours)
.post(createTour);

app.route('/api/v1/tours/:id')
.get(getTour)
.patch(updateTour)
.delete(deleteTour);
