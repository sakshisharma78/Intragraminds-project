const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: 100
  },
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: 0
  },
  description: {
    type: String,
    maxlength: 500
  },
  sku: {
    type: String,
    required: [true, 'Please provide SKU'],
    unique: true,
    trim: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  unit: {
    type: String,
    required: [true, 'Please provide unit of measurement'],
    enum: ['piece', 'kg', 'liter', 'meter', 'set']
  },
  manufacturer: {
    type: String,
    required: [true, 'Please provide manufacturer name']
  },
  lastRestocked: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for frequently queried fields
productSchema.index({ category: 1 });
productSchema.index({ sku: 1 });

// Virtual for formatted price
productSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Static method to get products by category
productSchema.statics.getProductsByCategory = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$category',
        products: { $push: '$$ROOT' },
        count: { $sum: 1 }
      }
    }
  ]);
};

// Static method to get low stock products
productSchema.statics.getLowStockProducts = async function(threshold = 10) {
  return this.find({
    stockQuantity: { $lte: threshold },
    inStock: true
  }).sort('stockQuantity');
};

// Pre-save middleware to check stock status
productSchema.pre('save', function(next) {
  if (this.stockQuantity === 0) {
    this.inStock = false;
  } else {
    this.inStock = true;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);