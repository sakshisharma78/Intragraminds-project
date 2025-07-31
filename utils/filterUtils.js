// Build MongoDB query based on filter parameters
exports.buildQuery = (filters) => {
  const query = {};

  // Date range filter
  if (filters.startDate && filters.endDate) {
    query.date = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate)
    };
  }

  // Region filter
  if (filters.region) {
    query.region = filters.region;
  }

  // Category filter
  if (filters.category) {
    query.category = filters.category;
  }

  // Status filter
  if (filters.status) {
    query.status = filters.status;
  }

  // Price range filter
  if (filters.minAmount || filters.maxAmount) {
    query.amount = {};
    if (filters.minAmount) query.amount.$gte = Number(filters.minAmount);
    if (filters.maxAmount) query.amount.$lte = Number(filters.maxAmount);
  }

  // Search text in multiple fields
  if (filters.search) {
    query.$or = [
      { 'customer.name': { $regex: filters.search, $options: 'i' } },
      { 'product.name': { $regex: filters.search, $options: 'i' } },
      { category: { $regex: filters.search, $options: 'i' } }
    ];
  }

  return query;
};

// Build sort options
exports.buildSortOptions = (sortField, sortOrder) => {
  const sortOptions = {};
  
  if (sortField && sortOrder) {
    sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1;
  } else {
    // Default sort by date descending
    sortOptions.date = -1;
  }

  return sortOptions;
};

// Build pagination options
exports.buildPaginationOptions = (page = 1, limit = 10) => {
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    skip: (parseInt(page) - 1) * parseInt(limit)
  };

  return options;
};

// Format date range for queries
exports.formatDateRange = (range) => {
  const now = new Date();
  let startDate, endDate;

  switch (range) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      endDate = new Date(now.setHours(23, 59, 59, 999));
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      endDate = new Date();
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      endDate = new Date();
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      endDate = new Date();
      break;
    default:
      startDate = new Date(now.setMonth(now.getMonth() - 1)); // Default to last 30 days
      endDate = new Date();
  }

  return { startDate, endDate };
};

// Format aggregation results
exports.formatAggregationResults = (results, type) => {
  switch (type) {
    case 'salesByCategory':
      return results.map(item => ({
        category: item._id,
        total: item.totalSales,
        count: item.count,
        percentage: ((item.totalSales / results.reduce((acc, curr) => acc + curr.totalSales, 0)) * 100).toFixed(2)
      }));

    case 'revenueByRegion':
      return results.map(item => ({
        region: item._id,
        revenue: item.totalSales,
        percentage: ((item.totalSales / results.reduce((acc, curr) => acc + curr.totalSales, 0)) * 100).toFixed(2)
      }));

    case 'salesTrend':
      return results.map(item => ({
        date: item._id,
        sales: item.totalSales
      }));

    default:
      return results;
  }
};

// Calculate growth percentages
exports.calculateGrowth = (current, previous) => {
  if (!previous || previous === 0) return 100;
  return (((current - previous) / previous) * 100).toFixed(2);
};

// Format currency
exports.formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};