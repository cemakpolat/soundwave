// models/Track.js
module.exports = (sequelize, DataTypes) => {
  const Track = sequelize.define('Track', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0 // Duration should be non-negative
      }
    },
    s3_key: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    cover_image_key: {
      type: DataTypes.TEXT
    },
    play_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },{
    tableName: 'Tracks'
  });

  return Track;
};