// models/Follow.js
module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    followerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    followeeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false, // Disable timestamps (createdAt, updatedAt)
    uniqueKeys: {
      unique_follow: {
        fields: ['followerId', 'followeeId']
      }
    }
  }, {
    tableName: 'Follows' // Add this line
  });

  return Follow;
};