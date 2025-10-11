// models/index.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const {sequelize} = require('../config/database');

dotenv.config();

const User = require('./User')(sequelize, Sequelize.DataTypes);
const Track = require('./Track')(sequelize, Sequelize.DataTypes);
const Playlist = require('./Playlist')(sequelize, Sequelize.DataTypes);
const PlaylistTrack = require('./PlaylistTrack')(sequelize, Sequelize.DataTypes);
const Comment = require('./Comment')(sequelize, Sequelize.DataTypes);
const Like = require('./Like')(sequelize, Sequelize.DataTypes);
const Follow = require('./Follow')(sequelize, Sequelize.DataTypes);
const Notification = require('./Notification')(sequelize, Sequelize.DataTypes);
const PlayHistory = require('./PlayHistory')(sequelize, Sequelize.DataTypes);
const Queue = require('./Queue')(sequelize, Sequelize.DataTypes);
const Album = require('./Album')(sequelize, Sequelize.DataTypes);
const AlbumTrack = require('./AlbumTrack')(sequelize, Sequelize.DataTypes);

module.exports = {
  sequelize,
  User,
  Track,
  Playlist,
  PlaylistTrack,
  Comment,
  Like,
  Follow,
  Notification,
  PlayHistory,
  Queue,
  Album,
  AlbumTrack,
};

require('./associations')(module.exports);

// Sync models with the database
sequelize.sync({ alter: true }).then(() => {
    console.log('Database synchronized.');
});