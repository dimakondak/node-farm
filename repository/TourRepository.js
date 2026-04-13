const MongoRepository = require('./MongoRepository');
const TourModel = require('./models/Tour');

class TourRepository extends MongoRepository {
  constructor() {
    super(TourModel);
  }

  async prepareMonthlyPlan(year) {
    return this.model.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      { $addFields: { month: '$_id' } },
      { $sort: { numTourStarts: -1 } },
      { $project: { _id: 0 } }, // hide _id
      { $limit: 12 },
    ]);
  }

  async prepareStatistics() {
    return this.model.aggregate([
      { $match: { ratingAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          tourCount: { $sum: 1 },
          numRatings: { $sum: '$ratingQuantity' },
          avgRating: { $avg: '$ratingAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { tourCount: -1 },
      },
      { $match: { _id: { $ne: 'EASY' } } },
    ]);
  }

  async countToursToSkip(filter, page, limit) {
    const skipQuantity = (page - 1) * limit;

    if (page) {
      const recordsQuantity = await this.count(filter);
      if (skipQuantity >= recordsQuantity) {
        throw new Error('This page does not exist');
      }
    }

    return skipQuantity;
  }
}

module.exports = new TourRepository();
