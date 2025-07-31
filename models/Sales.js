const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Please provide sale amount'],
    min: 0
  },
  date: {
    type: Date,
    required: [true, 'Please provide sale date'],
    default: Date.now
  },
  region: {
    type: String,
    required: [true, 'Please provide region'],
    enum: ['North', 'South', 'East', 'West', 'Central']
  },
  category: {
    type: String,
    required: [true, 'Please provide product category']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Please provide product reference']
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Please provide customer reference']
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'cancelled'],
    default: 'completed'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'cash', 'bank_transfer'],
    required: true
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for frequently queried fields
salesSchema.index({ date: 1 });
salesSchema.index({ region: 1 });
salesSchema.index({ category: 1 });

// Virtual for formatted date
salesSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString();
});

// Static method to get total sales by region
salesSchema.statics.getTotalSalesByRegion = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$region',
        totalSales: { $sum: '$amount' }
      }
    }
  ]);
};

// Static method to get sales by category
salesSchema.statics.getSalesByCategory = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$category',
        totalSales: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
};

// Static method to get sales trend by date range
salesSchema.statics.getSalesTrend = async function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        totalSales: { $sum: '$amount' }
      }
    },
    { $sort: { '_id': 1 } }
  ]);
};

module.exports = mongoose.model('Sales', salesSchema);