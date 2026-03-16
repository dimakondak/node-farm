const mongoose = require('mongoose');
const app = require('./app');

process.on('uncaughtException', (error) => {
  console.error(error.name, error.message);
});

const port = process.env.PORT || 3000;
const db_uri = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_KEY
);

mongoose
  .connect(db_uri)
  .then((instance) => {
    console.log(
      'Successfully connected to database:',
      instance.connections[0].name
    );
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on('unhandledRejection', (error) => {
  console.error(error.name, error.message);
  server.close();
});
