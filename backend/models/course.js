const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  courseName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'course_name'
  },
  courseFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'course_fee'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'courses',
  timestamps: false // No createdAt/updatedAt for this table
});

module.exports = Course;