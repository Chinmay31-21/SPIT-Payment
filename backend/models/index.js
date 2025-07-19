const sequelize = require('../config/database');
const User = require('./user');
const Course = require('./course');
const Payment = require('./payment');

// A User can make many Payments
User.hasMany(Payment, {
  foreignKey: 'userId',
  as: 'payments'
});
Payment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// A Course can be associated with many Payments
Course.hasMany(Payment, {
  foreignKey: 'courseId',
  as: 'payments'
});
Payment.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
});

// Export all models and the sequelize instance
const db = {
  sequelize,
  User,
  Course,
  Payment
};

module.exports = db;