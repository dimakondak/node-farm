const mongoose = require('mongoose');
const UserRepository = require('../repository/UserRepository');
const TourRepository = require('../repository/TourRepository');
const ReviewRepository = require('../repository/ReviewRepository');

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
const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
const reviews = JSON.parse(fs.readFileSync('./data/reviews.json', 'utf8'));

const seedData = () => {
  Promise.all([
    UserRepository.create(users),
    TourRepository.create(tours),
    ReviewRepository.create(reviews),
  ])
    .then(() => {
      console.log('Successfully seeded data');
    })
    .catch((error) => {
      console.error('Error seeding data:', error.message);
    })
    .finally(() => {
      process.exit(0);
    });
};

const unseedData = () => {
  Promise.all([
    UserRepository.deleteMany(),
    TourRepository.deleteMany(),
    ReviewRepository.deleteMany(),
  ])
    .then(() => {
      console.log('Successfully unseeded data');
    })
    .catch((error) => {
      console.error('Error unseeding data:', error.message);
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
