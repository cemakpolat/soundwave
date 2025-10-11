// models/associations.js
module.exports = (models) => {
    const { User, Track, Playlist, PlaylistTrack, Comment, Like, Follow, Notification, PlayHistory, Queue, Album, AlbumTrack } = models;

    // User Associations
    User.hasMany(Track, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'tracks' });
    User.hasMany(Playlist, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'playlists' });
    User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'comments' });
    User.hasMany(Like, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'likes' });
    User.hasMany(Follow, { foreignKey: 'followerId', onDelete: 'CASCADE', as: 'following' }); // Users the user is following
    User.hasMany(Follow, { foreignKey: 'followeeId', onDelete: 'CASCADE', as: 'followers' }); // Users following the user
    User.hasMany(Notification, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'notifications' });
    User.hasMany(PlayHistory, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'playHistory' });
    User.hasMany(Queue, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'queue' });
    User.hasMany(Album, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'albums' });
  
    // Track Associations
    Track.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Track.hasMany(Comment, { foreignKey: 'trackId', onDelete: 'CASCADE', as: 'comments' });
    Track.hasMany(Like, { foreignKey: 'trackId', onDelete: 'CASCADE', as: 'likes' });
    Track.belongsToMany(Playlist, { through: PlaylistTrack, foreignKey: 'trackId', otherKey: 'playlistId', as: 'playlists' }); //Track has many playlists
    Track.hasMany(PlayHistory, { foreignKey: 'trackId', onDelete: 'CASCADE', as: 'playHistory' });
    Track.hasMany(Queue, { foreignKey: 'trackId', onDelete: 'CASCADE', as: 'queues' });
    Track.belongsToMany(Album, { through: AlbumTrack, foreignKey: 'trackId', otherKey: 'albumId', as: 'albums' }); // Track can be in many albums
  
    // Playlist Associations
    Playlist.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Playlist.belongsToMany(Track, { through: PlaylistTrack, foreignKey: 'playlistId', otherKey: 'trackId', as: 'tracks' }); //Playlist has many tracks
  
    // Comment Associations
    Comment.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Comment.belongsTo(Track, { foreignKey: 'trackId', onDelete: 'CASCADE' });
  
    // Like Associations
    Like.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Like.belongsTo(Track, { foreignKey: 'trackId', onDelete: 'CASCADE' });
  
    // Follow Associations
    Follow.belongsTo(User, { foreignKey: 'followerId', onDelete: 'CASCADE', as: 'follower' }); // Alias for the follower
    Follow.belongsTo(User, { foreignKey: 'followeeId', onDelete: 'CASCADE', as: 'followee' }); // Alias for the followee
  
    // Notification Associations
    Notification.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

    // PlayHistory Associations
    PlayHistory.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    PlayHistory.belongsTo(Track, { foreignKey: 'trackId', onDelete: 'CASCADE' });

    // Queue Associations
    Queue.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Queue.belongsTo(Track, { foreignKey: 'trackId', onDelete: 'CASCADE' });

    // Album Associations
    Album.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Album.belongsToMany(Track, { through: AlbumTrack, foreignKey: 'albumId', otherKey: 'trackId', as: 'tracks' }); // Album has many tracks

    // AlbumTrack Associations
    AlbumTrack.belongsTo(Album, { foreignKey: 'albumId', onDelete: 'CASCADE' });
    AlbumTrack.belongsTo(Track, { foreignKey: 'trackId', onDelete: 'CASCADE' });
  };