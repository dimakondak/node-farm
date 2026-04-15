class MongoRepository {
  constructor(model) {
    this.model = model;
  }

  async find(filter = {}, options = {}) {
    const query = this.model.find(filter);

    if (options.sort) {
      query.sort(options.sort);
    }

    if (options.select) {
      query.select(options.select);
    }

    if (options.skip) {
      query.skip(options.skip);
    }

    if (options.limit) {
      query.limit(options.limit);
    }

    if (options.populate) {
      query.populate(options.populate);
    }

    return await query;
  }

  async findById(id, options = {}) {
    const query = this.model.findById(id);

    if (options.select) {
      query.select(options.select);
    }

    if (options.populate) {
      query.populate(options.populate);
    }

    return query;
  }

  async create(payload) {
    return this.model.create(payload);
  }

  async updateById(
    id,
    payload,
    options = { returnDocument: 'after', runValidators: true }
  ) {
    return this.model.findByIdAndUpdate(id, payload, options);
  }

  async deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }

  async deleteMany() {
    return this.model.deleteMany();
  }
}

module.exports = MongoRepository;
