const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 3000;
const db_uri = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_KEY
);

mongoose
  .connect(db_uri)
  .then((connection) => {
    console.log('Successfully connected to database', connection);
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});