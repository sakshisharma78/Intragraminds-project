const Sales = require('../models/Sales');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

// Helper function to generate random number within range
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// Helper function to generate random date within range
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Sample data
const regions = ['North', 'South', 'East', 'West', 'Central'];
const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Home & Garden'];
const productNames = {
  Electronics: ['Smartphone', 'Laptop', 'Tablet', 'Headphones', 'Smart Watch'],
  Clothing: ['T-Shirt', 'Jeans', 'Dress', 'Jacket', 'Shoes'],
  Food: ['Coffee', 'Tea', 'Snacks', 'Beverages', 'Chocolates'],
  Books: ['Fiction', 'Non-Fiction', 'Educational', 'Comics', 'Magazines'],
  'Home & Garden': ['Plants', 'Furniture', 'Decor', 'Kitchen Tools', 'Lighting']
};

// Generate mock products
const generateProducts = async () => {
  try {
    const products = [];
    
    for (const category of categories) {
      for (const name of productNames[category]) {
        products.push({
          name,
          category,
          price: randomNumber(10, 1000),
          description: `Description for ${name}`,
          sku: `SKU-${category.substring(0, 3).toUpperCase()}-${randomNumber(1000, 9999)}`,
          stockQuantity: randomNumber(0, 100),
          unit: 'piece',
          manufacturer: 'Sample Manufacturer'
        });
      }
    }

    await Product.deleteMany({});
    return await Product.insertMany(products);
  } catch (err) {
    console.error('Error generating products:', err);
    throw err;
  }
};

// Generate mock customers
const generateCustomers = async () => {
  try {
    const customers = [];
    const customerTypes = ['individual', 'business'];

    for (let i = 0; i < 50; i++) {
      const customerType = customerTypes[randomNumber(0, 1)];
      customers.push({
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        region: regions[randomNumber(0, regions.length - 1)],
        phone: `+1${randomNumber(1000000000, 9999999999)}`,
        address: {
          street: `${randomNumber(100, 999)} Sample Street`,
          city: 'Sample City',
          state: 'Sample State',
          zipCode: `${randomNumber(10000, 99999)}`,
          country: 'USA'
        },
        customerType,
        status: 'active',
        totalPurchases: 0
      });
    }

    await Customer.deleteMany({});
    return await Customer.insertMany(customers);
  } catch (err) {
    console.error('Error generating customers:', err);
    throw err;
  }
};

// Generate mock sales
const generateSales = async (products, customers) => {
  try {
    const sales = [];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const endDate = new Date();
    const paymentMethods = ['credit_card', 'debit_card', 'cash', 'bank_transfer'];

    // Generate 500 sales records
    for (let i = 0; i < 500; i++) {
      const product = products[randomNumber(0, products.length - 1)];
      const customer = customers[randomNumber(0, customers.length - 1)];

      sales.push({
        amount: product.price * randomNumber(1, 5),
        date: randomDate(startDate, endDate),
        region: customer.region,
        category: product.category,
        product: product._id,
        customer: customer._id,
        status: 'completed',
        paymentMethod: paymentMethods[randomNumber(0, paymentMethods.length - 1)],
        notes: `Sale record ${i + 1}`
      });
    }

    await Sales.deleteMany({});
    const createdSales = await Sales.insertMany(sales);

    // Update customer total purchases
    for (const customer of customers) {
      const customerSales = createdSales.filter(sale => 
        sale.customer.toString() === customer._id.toString()
      );
      customer.totalPurchases = customerSales.length;
      customer.lastPurchaseDate = customerSales.length > 0 ?
        customerSales[customerSales.length - 1].date : null;
      await customer.save();
    }

    return createdSales;
  } catch (err) {
    console.error('Error generating sales:', err);
    throw err;
  }
};

// Main ETL job
exports.run = async () => {
  try {
    console.log('Starting ETL job...');
    
    // Generate products
    console.log('Generating products...');
    const products = await generateProducts();
    console.log(`Generated ${products.length} products`);

    // Generate customers
    console.log('Generating customers...');
    const customers = await generateCustomers();
    console.log(`Generated ${customers.length} customers`);

    // Generate sales
    console.log('Generating sales...');
    const sales = await generateSales(products, customers);
    console.log(`Generated ${sales.length} sales records`);

    console.log('ETL job completed successfully');
    return true;
  } catch (err) {
    console.error('ETL job failed:', err);
    throw err;
  }
};