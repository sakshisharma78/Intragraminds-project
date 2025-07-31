const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getKPIData,
  getSalesTrend,
  getSalesByCategory,
  getRevenueByRegion,
  getDetailedSales,
  exportSales
} = require('../controllers/dashboardController');

// Input validation middleware
const { query, validationResult } = require('express-validator');

const validateDateRange = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date')
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

const validateFilters = [
  query('region')
    .optional()
    .isIn(['North', 'South', 'East', 'West', 'Central'])
    .withMessage('Invalid region'),
  query('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty if provided')
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

// Routes
// All routes are protected and accessible by both admin and viewer roles
router.use(protect);

// KPI Data
router.get('/kpi', validateDateRange, validate, getKPIData);

// Charts Data
router.get('/sales-trend', validateDateRange, validate, getSalesTrend);
router.get('/sales-by-category', getSalesByCategory);
router.get('/revenue-by-region', getRevenueByRegion);

// Detailed Data
router.get(
  '/detailed-sales',
  [
    ...validateDateRange,
    ...validatePagination,
    ...validateFilters
  ],
  validate,
  getDetailedSales
);

// Export Data
router.get(
  '/export-sales',
  [
    ...validateDateRange,
    ...validateFilters
  ],
  validate,
  exportSales
);

module.exports = router;