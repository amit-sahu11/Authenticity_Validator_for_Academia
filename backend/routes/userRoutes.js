// routes/userRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { generateToken } = require('../utils/jwt');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// REGISTER
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8 }).withMessage('Password min 8 chars'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password, role } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      const newUser = new User({ name, email, password, role: role || 'user' });
      await newUser.save();

      const token = generateToken(newUser._id, newUser.email, newUser.role);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: newUser.toJSON(),
      });
    } catch (error) {
      res.status(500).json({ message: 'Registration failed', error: error.message });
    }
  }
);

// LOGIN
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      user.lastLogin = new Date();
      await user.save();

      const token = generateToken(user._id, user.email, user.role);

      res.status(200).json({
        message: 'Login successful',
        token,
        user: user.toJSON(),
      });
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  }
);

// GET PROFILE (Protected)
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.status(200).json(user.toJSON());
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// ADMIN ONLY
router.get('/admin/users', authenticate, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

module.exports = router;
