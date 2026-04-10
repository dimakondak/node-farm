const MongoRepository = require('./MongoRepository');
const TourModel = require('./models/Tour');

class TourRepository extends MongoRepository {
  constructor() {
    super(TourModel);
  }

  async prepareMonthlyPlan(year) {
    this.model.aggregate([
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
    this.model.aggregate([
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

  createDBQuery(requestQuery) {
    const query = { ...requestQuery };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete query[field]);

    // Handle advanced filtering operators (gte, gt, lte, lt) by adding '$' prefix
    const queryStr = JSON.stringify(query).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    return JSON.parse(queryStr);
  }

  async preparePaginationProperties(requestQuery, dbQuery, aliasQuery) {
    const page = +(aliasQuery?.page ?? requestQuery.page ?? 1);
    const limit = +(aliasQuery?.limit ?? requestQuery.limit ?? 10);
    const skipQuantity = (page - 1) * limit;

    if (requestQuery.page) {
      const numDocs = await this.countTours(dbQuery);
      if (skipQuantity >= numDocs) {
        throw new Error('This page does not exist');
      }
    }

    return { limit, skipQuantity };
  }
}

module.exports = new TourRepository();
