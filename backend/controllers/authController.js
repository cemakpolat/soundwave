// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const dotenv = require('dotenv');
const { Op } = require('sequelize');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register a new user
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the user
    const user = await User.create({
      username,
      email,
      password_hash: passwordHash,
      role: role || 'listener', // Default role is 'listener'
    });

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '1h',
    });

    // Return user data with virtual fields
    const userJSON = user.toJSON();
    const { password_hash, ...userWithoutPassword } = userJSON;

    res.status(201).json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login a user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password' });
    }

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check the password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '1h',
    });

    // Respond with token and user information (excluding password_hash)
    // Use toJSON() to ensure virtual fields like profileImage are included
    const userJSON = user.toJSON();
    const { password_hash, ...userWithoutPassword } = userJSON;

    console.log('Login successful, user profileImage:', userWithoutPassword.profileImage);

    res
      .status(200)
      .json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const banUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is already banned
    if (user.isBanned) {
      return res.status(400).json({ message: 'User is already banned' });
    }

    // Ban the user
    user.isBanned = true;
    await user.save();

    res.status(200).json({ message: 'User banned successfully' });
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const unbanUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is already unbanned
    if (!user.isBanned) {
      return res.status(400).json({ message: 'User is not banned' });
    }

    // Unban the user
    user.isBanned = false;
    await user.save();

    res.status(200).json({ message: 'User unbanned successfully' });
  } catch (error) {
    console.error('Error unbanning user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { register, login,  banUser, unbanUser };