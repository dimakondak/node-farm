const MongoRepository = require('./MongoRepository');
const UserModel = require('./models/User');
const crypto = require('crypto');

class UserRepository extends MongoRepository {
  constructor() {
    super(UserModel);
  }

  async findUserByEmail(email, options = {}) {
    return this.model.findOne({ email }, options);
  }

  async findUserByResetToken(token) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    return this.model.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
  }

  async resetPassword(user, password, passwordConfirm) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.password = password;
    user.passwordConfirm = passwordConfirm;

    await user.save({ validateBeforeSave: true });
  }
}

module.exports = new UserRepository();
