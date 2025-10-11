// models/Album.js
module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define('Album', {
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
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    genre: {
      type: DataTypes.STRING(50)
    },
    coverImageKey: {
      type: DataTypes.TEXT
    },
    releaseDate: {
      type: DataTypes.DATE
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'Albums',
    timestamps: true
  });

  return Album;
};
