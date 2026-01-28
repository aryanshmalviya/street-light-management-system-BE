const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/authMiddleware');

// Validation middleware
const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  '/register',
  validateRegister,
  handleValidationErrors,
  authController.register
);

router.post(
  '/login',
  validateLogin,
  handleValidationErrors,
  authController.login
);


router.get('/profile', authController.getProfile);

module.exports = router;
