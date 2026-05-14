const MongoRepository = require('./MongoRepository');
const ReviewModel = require('./models/Review');

class ReviewRepository extends MongoRepository {
  constructor() {
    super(ReviewModel);
  }

  async findReviewsByTourId(tourId) {
    const filter = tourId && { tour: { $eq: tourId } };

    return this.find(filter);
  }
}

module.exports = new ReviewRepository();
