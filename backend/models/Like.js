// models/Like.js
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    createdAt: { // Explicitly define createdAt if needed, Sequelize manages it by default
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    // Add unique constraint for userId and trackId to prevent duplicate likes
    uniqueKeys: {
      unique_like: {
        fields: ['userId', 'trackId']
      }
    },
    timestamps: false // Disable timestamps (createdAt, updatedAt)
  }, {
    tableName: 'Likes'
  });

  return Like;
};