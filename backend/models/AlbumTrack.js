// models/AlbumTrack.js
module.exports = (sequelize, DataTypes) => {
  const AlbumTrack = sequelize.define('AlbumTrack', {
    albumId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Albums',
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
    trackNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    tableName: 'AlbumTracks',
    timestamps: false
  });

  return AlbumTrack;
};
