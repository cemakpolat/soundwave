// controllers/notificationController.js
const { Notification } = require('../models');

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // Get userId from decoded JWT token

    const notifications = await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getNotifications,
};