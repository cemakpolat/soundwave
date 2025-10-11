// syncDatabase.js - Safely sync database schema with models
const { sequelize } = require('./config/database');
const dotenv = require('dotenv');

dotenv.config();

const syncDatabase = async () => {
  try {
    console.log('🔄 Syncing database schema...');

    // Use alter: true to safely add new columns without dropping existing data
    await sequelize.sync({ alter: true });

    console.log('✅ Database schema synced successfully!');
    console.log('   New columns added:');
    console.log('   - Users.bio');
    console.log('   - Users.location');
    console.log('   - Users.profile_picture_key');
    console.log('   - Users.social_links');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    process.exit(1);
  }
};

syncDatabase();
