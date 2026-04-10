const MongoRepository = require('./MongoRepository');
const ReviewModel = require('./models/Review');

class ReviewRepository extends MongoRepository {
  constructor() {
    super(ReviewModel);
  }
}

module.exports = new ReviewRepository();
