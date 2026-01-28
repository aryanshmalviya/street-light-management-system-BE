const db = require('../database/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { ulid } = require('ulid');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, password, name, role = 'operator' } = req.body;

    // Check if user exists
    const userExists = await db.query('SELECT user_id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);
    const user_id = ulid();
    // Create user
    const result = await db.query(
      'INSERT INTO users (user_id, email, password, name, role) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, email, name, role',
      [user_id, email, password, name, role]
    );

    logger.info(`User registered: ${email}`);
    res.status(201).json({
      message: 'User registered successfully',
      userId: result.rows[0].id,
      user: result.rows[0]
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await db.query('SELECT user_id, email, name, role, password FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];



    // const validPassword = await bcrypt.compare(password, user.password);
    if (password !== user.password  ) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // // Generate JWT token
    // const token = jwt.sign(
    //   { id: user.id, email: user.email, role: user.role },
    //   process.env.JWT_SECRET || 'your-secret-key',
    //   { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    // );

    logger.info(`User logged in: ${email}`);
    res.json({
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.body.user_id;

    const result = await db.query(
      'SELECT user_id, email, name, role FROM users WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};
