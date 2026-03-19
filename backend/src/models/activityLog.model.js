const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ActivityLog = sequelize.define('ActivityLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  // ✅ STRING instead of ENUM — avoids MySQL "too many keys" error
  action: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },

  module: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },

  description: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },

  performedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  performedByName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'System',
  },

  performedByRole: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'system',
  },

  targetId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  targetName: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },

  ipAddress: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },

}, {
  timestamps: true,
  updatedAt: false,  // logs are immutable
  indexes:   [],     // ✅ disable auto-indexes to stay under MySQL's 64-key limit
});

module.exports = ActivityLog;