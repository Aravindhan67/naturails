const mongoose = require('mongoose');
const dns = require('dns');

// Configure reliable DNS servers to avoid Windows Node.js querySrv ECONNREFUSED on MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if not permitted
}

const dbStore = require('../data/dbStore');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Contact = require('../models/Contact');
const { initialProducts } = require('../data/seedData');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/natural_ecommerce';
  console.log(`Connecting to MongoDB at: ${uri}...`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    dbStore.setMongooseActive(true);

    // Check if products need seeding in MongoDB
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Seeding initial natural products into MongoDB with database-stored images...');
      await Product.insertMany(initialProducts);
      console.log('MongoDB products seeded successfully.');
    }

    // Check if default admin needs seeding
    const adminExists = await User.findOne({ email: 'admin@naturalis.com' });
    if (!adminExists) {
      await User.create({
        name: 'Botanical Store Admin',
        email: 'admin@naturalis.com',
        password: 'admin123',
        role: 'admin',
        phone: '+91 98765 43210',
        address: {
          street: '12 Organic Forest Way',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India',
        },
      });
      console.log('Default Admin created in MongoDB: admin@naturalis.com / admin123');
    }

    const demoUserExists = await User.findOne({ email: 'elena@naturalis.com' });
    if (!demoUserExists) {
      await User.create({
        name: 'Elena Vance',
        email: 'elena@naturalis.com',
        password: 'user123',
        role: 'user',
        phone: '+91 91234 56789',
        address: {
          street: '45 Green Meadow Lane',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          postalCode: '641001',
          country: 'India',
        },
      });
      console.log('Demo Customer created in MongoDB: elena@naturalis.com / user123');
    }
  } catch (error) {
    console.warn('------------------------------------------------------------');
    console.warn(`MongoDB Notice: Could not connect to MongoDB server (${error.message}).`);
    console.warn('Switching to local persistent JSON Database engine (zero configuration needed).');
    console.warn('All features, users, image storage in DB, orders & tracking are 100% active!');
    console.warn('To use MongoDB, start your local mongod or set MONGO_URI in backend/.env');
    console.warn('------------------------------------------------------------');
    dbStore.setMongooseActive(false);
  }
};

module.exports = connectDB;
