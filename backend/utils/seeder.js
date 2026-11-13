const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Contact = require('../models/Contact');
const { initialProducts } = require('../data/seedData');
const dbStore = require('../data/dbStore');

const seedData = async () => {
  try {
    await connectDB();

    if (dbStore.isMongoose) {
      console.log('Clearing old collections in MongoDB...');
      await Product.deleteMany();
      await User.deleteMany();
      await Order.deleteMany();
      await Contact.deleteMany();

      console.log('Inserting products with database-stored images...');
      await Product.insertMany(initialProducts);

      console.log('Inserting users...');
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

      console.log('MongoDB Seed complete!');
    } else {
      console.log('Re-initializing fallback JSON store...');
      dbStore.seedInitial();
      console.log('JSON Store seeded successfully!');
    }

    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedData();
