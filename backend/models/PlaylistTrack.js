module.exports = (sequelize, DataTypes) => {
  const PlaylistTrack = sequelize.define('PlaylistTrack', {
    playlistId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Playlists',
        key: 'id'
      }
    },
    trackId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Tracks',
        key: 'id'
      }
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0
      }
    }
  }, {
    tableName: 'PlaylistTracks', // Make sure this is correct!
    timestamps: false // Disable timestamps (createdAt, updatedAt)
  });
  return PlaylistTrack;
};