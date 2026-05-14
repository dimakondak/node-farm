const MongoRepository = require('./MongoRepository');
const ReservationModel = require('./models/Reservation');

class ReservationRepository extends MongoRepository {
  constructor() {
    super(ReservationModel);
  }

  async findReservationsByUserId(userId) {
    const filter = userId && { user: { $eq: userId } };

    return this.find(filter);
  }
}

module.exports = new ReservationRepository();
