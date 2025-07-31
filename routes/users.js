const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');

// Input validation middleware
const { body, query, param, validationResult } = require('express-validator');

const validateUserCreation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .isIn(['admin', 'viewer'])
    .withMessage('Role must be either admin or viewer')
];

const validateUserUpdate = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('role')
    .optional()
    .isIn(['admin', 'viewer'])
    .withMessage('Role must be either admin or viewer')
];

const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

const validateUserId = [
  param('id').isMongoId().withMessage('Invalid user ID')
];

// Validation result middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => err.msg)
    });
  }
  next();
};

// Protect all routes
router.use(protect);
// Restrict all routes to admin
router.use(authorize('admin'));

// User management routes
router
  .route('/')
  .get(validatePagination, validate, getUsers)
  .post(validateUserCreation, validate, createUser);

router
  .route('/:id')
  .get(validateUserId, validate, getUser)
  .put([...validateUserId, ...validateUserUpdate], validate, updateUser)
  .delete(validateUserId, validate, deleteUser);

// User statistics route
router.get('/stats/overview', getUserStats);

module.exports = router;