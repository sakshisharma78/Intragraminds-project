const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Sales = require('../models/Sales');
const { buildQuery, buildSortOptions, buildPaginationOptions } = require('../utils/filterUtils');

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
    .withMessage('Category cannot be empty if provided'),
  query('minAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum amount must be a positive number'),
  query('maxAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum amount must be a positive number')
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

// @route   GET /api/sales
// @desc    Get all sales with filtering and pagination
// @access  Private
router.get('/', [
  ...validateDateRange,
  ...validatePagination,
  ...validateFilters
], validate, async (req, res) => {
  try {
    const query = buildQuery(req.query);
    const sortOptions = buildSortOptions(req.query.sortField, req.query.sortOrder);
    const { page, limit, skip } = buildPaginationOptions(req.query.page, req.query.limit);

    const sales = await Sales.find(query)
      .populate('product', 'name price category')
      .populate('customer', 'name email region')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await Sales.countDocuments(query);

    res.json({
      success: true,
      data: sales,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sales data',
      error: err.message
    });
  }
});

// @route   GET /api/sales/summary
// @desc    Get sales summary statistics
// @access  Private
router.get('/summary', validateDateRange, validate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = startDate && endDate ? { date: { $gte: new Date(startDate), $lte: new Date(endDate) } } : {};

    const summary = await Sales.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: '$amount' },
          averageOrderValue: { $avg: '$amount' },
          minOrderValue: { $min: '$amount' },
          maxOrderValue: { $max: '$amount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: summary[0] || {
        totalSales: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        minOrderValue: 0,
        maxOrderValue: 0
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sales summary',
      error: err.message
    });
  }
});

// @route   GET /api/sales/trends
// @desc    Get sales trends over time
// @access  Private
router.get('/trends', validateDateRange, validate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = startDate && endDate ? { date: { $gte: new Date(startDate), $lte: new Date(endDate) } } : {};

    const trends = await Sales.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json({
      success: true,
      data: trends
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sales trends',
      error: err.message
    });
  }
});

// @route   GET /api/sales/export
// @desc    Export sales data
// @access  Private
router.get('/export', [
  ...validateDateRange,
  ...validateFilters
], validate, async (req, res) => {
  try {
    const query = buildQuery(req.query);
    const sortOptions = buildSortOptions(req.query.sortField, req.query.sortOrder);

    const sales = await Sales.find(query)
      .populate('product', 'name price category')
      .populate('customer', 'name email region')
      .sort(sortOptions);

    const exportData = sales.map(sale => ({
      Date: sale.date.toISOString().split('T')[0],
      Amount: sale.amount,
      Region: sale.region,
      Category: sale.category,
      Product: sale.product.name,
      'Product Price': sale.product.price,
      Customer: sale.customer.name,
      'Customer Email': sale.customer.email,
      Status: sale.status,
      PaymentMethod: sale.paymentMethod
    }));

    res.json({
      success: true,
      data: exportData
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error exporting sales data',
      error: err.message
    });
  }
});

module.exports = router;