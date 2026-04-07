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

const tours = JSON.parse(fs.readFileSync('./data/tours.json', 'utf8'));

const seedData = () => {
  TourModel.create(tours)
    .then(() => {
      console.log('Successfully seeded tours');
    })
    .catch((error) => {
      console.error('Error seeding Tour:', error.message);
    })
    .finally(() => {
      process.exit(0);
    });
};

const unseedData = () => {
  TourModel.deleteMany()
    .then(() => {
      console.log('Successfully unseeded tours');
    })
    .catch((error) => {
      console.error('Error unseeding tours:', error.message);
    })
    .finally(() => {
      process.exit(0);
    });
};

switch (process.argv[2]) {
  case '--up':
    return seedData();
  case '--down':
    return unseedData();
  default:
    process.exit(0);
}
