// models/PlayHistory.js
module.exports = (sequelize, DataTypes) => {
  const PlayHistory = sequelize.define('PlayHistory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    trackId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tracks',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    playedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    tableName: 'PlayHistory',
    timestamps: false,
    indexes: [
      {
        fields: ['userId', 'playedAt']
      },
      {
        fields: ['trackId']
      }
    ]
  });

  return PlayHistory;
};
