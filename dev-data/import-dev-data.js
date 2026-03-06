const mongoose = require('mongoose');
const TourModel = require('../models/Tour');

const fs = require('fs');

process.loadEnvFile('../.env');
const db_uri = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_KEY
);

mongoose.connect(db_uri).then(() => {
  console.log('Successfully connected to database');
});

const tours = JSON.parse(fs.readFileSync('./data/tours-simple.json', 'utf8'));

const importData = () => {
  TourModel.create(tours)
    .then(() => {
      console.log('Successfully imported tours');
    })
    .catch((error) => {
      console.error('Error creating Tour:', error.message);
    })
    .finally(() => {
      process.exit(0);
    });
};

const deleteData = () => {
  TourModel.deleteMany()
    .then(() => {
      console.log('Successfully deleted all tours');
    })
    .catch((error) => {
      console.error('Error deleting tours:', error.message);
    })
    .finally(() => {
      process.exit(0);
    });
};

switch (process.argv[2]) {
  case '--import':
    return importData();
  case '--delete':
    return deleteData();
  default:
    process.exit(0);
}
