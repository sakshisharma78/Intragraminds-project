const Sales = require('../models/Sales');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

// @desc    Get KPI data
// @route   GET /api/dashboard/kpi
// @access  Private
exports.getKPIData = async (req, res, next) => {
  try {
    const startDate = new Date(req.query.startDate || new Date().setDate(new Date().getDate() - 30));
    const endDate = new Date(req.query.endDate || new Date());

    // Get total revenue
    const totalRevenue = await Sales.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get total orders
    const totalOrders = await Sales.countDocuments({
      date: { $gte: startDate, $lte: endDate },
      status: 'completed'
    });

    // Get new users (customers)
    const newUsers = await Customer.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    // Calculate bounce rate (simulated - in real world this would come from analytics)
    const bounceRate = Math.random() * (40 - 20) + 20; // Random between 20-40%

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalOrders,
        newUsers,
        bounceRate: bounceRate.toFixed(2)
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get sales trend data
// @route   GET /api/dashboard/sales-trend
// @access  Private
exports.getSalesTrend = async (req, res, next) => {
  try {
    const startDate = new Date(req.query.startDate || new Date().setDate(new Date().getDate() - 30));
    const endDate = new Date(req.query.endDate || new Date());

    const salesTrend = await Sales.getSalesTrend(startDate, endDate);

    res.status(200).json({
      success: true,
      data: salesTrend
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get sales by category
// @route   GET /api/dashboard/sales-by-category
// @access  Private
exports.getSalesByCategory = async (req, res, next) => {
  try {
    const salesByCategory = await Sales.getSalesByCategory();

    res.status(200).json({
      success: true,
      data: salesByCategory
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get revenue by region
// @route   GET /api/dashboard/revenue-by-region
// @access  Private
exports.getRevenueByRegion = async (req, res, next) => {
  try {
    const revenueByRegion = await Sales.getTotalSalesByRegion();

    res.status(200).json({
      success: true,
      data: revenueByRegion
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get detailed sales data
// @route   GET /api/dashboard/detailed-sales
// @access  Private
exports.getDetailedSales = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = {};
    
    // Add filters if provided
    if (req.query.region) query.region = req.query.region;
    if (req.query.category) query.category = req.query.category;
    if (req.query.startDate && req.query.endDate) {
      query.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const sales = await Sales.find(query)
      .populate('product', 'name price')
      .populate('customer', 'name email')
      .skip(startIndex)
      .limit(limit)
      .sort('-date');

    const total = await Sales.countDocuments(query);

    res.status(200).json({
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
    next(err);
  }
};

// @desc    Export sales data
// @route   GET /api/dashboard/export-sales
// @access  Private
exports.exportSales = async (req, res, next) => {
  try {
    const query = {};
    
    // Add filters if provided
    if (req.query.region) query.region = req.query.region;
    if (req.query.category) query.category = req.query.category;
    if (req.query.startDate && req.query.endDate) {
      query.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const sales = await Sales.find(query)
      .populate('product', 'name price')
      .populate('customer', 'name email')
      .sort('-date');

    // Format data for export
    const exportData = sales.map(sale => ({
      Date: sale.date.toLocaleDateString(),
      Amount: sale.amount,
      Region: sale.region,
      Category: sale.category,
      Product: sale.product.name,
      'Product Price': sale.product.price,
      Customer: sale.customer.name,
      'Customer Email': sale.customer.email,
      Status: sale.status
    }));

    res.status(200).json({
      success: true,
      data: exportData
    });
  } catch (err) {
    next(err);
  }
};