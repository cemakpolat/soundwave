// controllers/commentController.js
const { Comment, Track, User } = require('../models');

// Add a comment to a track
const addComment = async (req, res) => {
  try {
    const { trackId } = req.params;
    const userId = req.user.id; // Get the user ID from the authenticated user
    const { content } = req.body;

    const track = await Track.findByPk(trackId);
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    // Create the comment
    const comment = await Comment.create({
      userId,
      trackId,
      content
    });

    // Retrieve the comment with user information
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: {
        model: User,
        attributes: ['id', 'username'] // Include only necessary user attributes
      }
    });

    res.status(201).json({ comment: commentWithUser });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Get the user ID from the authenticated user

    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the user has permission to delete the comment (either the comment owner or an admin)
    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this comment' });
    }

    // Delete the comment
    await comment.destroy();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addComment,
  deleteComment,
};