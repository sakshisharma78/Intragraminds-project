const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide customer name'],
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Please provide customer email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  region: {
    type: String,
    required: [true, 'Please provide customer region'],
    enum: ['North', 'South', 'East', 'West', 'Central']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Please provide a valid phone number']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'USA'
    }
  },
  customerType: {
    type: String,
    enum: ['individual', 'business'],
    default: 'individual'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  totalPurchases: {
    type: Number,
    default: 0
  },
  lastPurchaseDate: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for frequently queried fields
customerSchema.index({ email: 1 });
customerSchema.index({ region: 1 });
customerSchema.index({ 'address.city': 1 });

// Virtual for full address
customerSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}, ${this.address.country}`;
});

// Static method to get customers by region
customerSchema.statics.getCustomersByRegion = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$region',
        customers: { $push: '$$ROOT' },
        count: { $sum: 1 }
      }
    }
  ]);
};

// Static method to get top customers by purchases
customerSchema.statics.getTopCustomers = async function(limit = 10) {
  return this.find()
    .sort('-totalPurchases')
    .limit(limit);
};

// Static method to get customer purchase statistics
customerSchema.statics.getPurchaseStats = async function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalCustomers: { $sum: 1 },
        avgPurchases: { $avg: '$totalPurchases' },
        maxPurchases: { $max: '$totalPurchases' },
        minPurchases: { $min: '$totalPurchases' }
      }
    }
  ]);
};

module.exports = mongoose.model('Customer', customerSchema);