const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { initialProducts } = require('./seedData');

const STORE_PATH = path.join(__dirname, 'store.json');

class DbStore {
  constructor() {
    this.isMongoose = false;
    this.memoryData = {
      users: [],
      products: [],
      orders: [],
      contacts: [],
    };
    this.initFileStore();
  }

  setMongooseActive(active) {
    this.isMongoose = active;
  }

  initFileStore() {
    try {
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        this.memoryData = JSON.parse(raw);
      } else {
        this.seedInitial();
      }
    } catch (err) {
      console.warn('Initializing fresh store due to:', err.message);
      this.seedInitial();
    }
  }

  save() {
    try {
      fs.writeFileSync(STORE_PATH, JSON.stringify(this.memoryData, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving store to file:', err.message);
    }
  }

  seedInitial() {
    // Default admin and demo customer passwords
    const salt = bcrypt.genSaltSync(10);
    const adminHashedPassword = bcrypt.hashSync('admin123', salt);
    const userHashedPassword = bcrypt.hashSync('user123', salt);

    this.memoryData.users = [
      {
        _id: 'usr_admin_001',
        name: 'Botanical Store Admin',
        email: 'admin@naturalis.com',
        password: adminHashedPassword,
        role: 'admin',
        phone: '+91 98765 43210',
        address: {
          street: '12 Organic Forest Way',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India',
        },
        createdAt: new Date().toISOString(),
      },
      {
        _id: 'usr_demo_002',
        name: 'Elena Vance',
        email: 'elena@naturalis.com',
        password: userHashedPassword,
        role: 'user',
        phone: '+91 91234 56789',
        address: {
          street: '45 Green Meadow Lane',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          postalCode: '641001',
          country: 'India',
        },
        createdAt: new Date().toISOString(),
      },
    ];

    this.memoryData.products = initialProducts.map((p, idx) => ({
      _id: `prod_nat_${String(idx + 1).padStart(3, '0')}`,
      ...p,
      createdAt: new Date().toISOString(),
    }));

    // Seed a sample order with tracking for demonstration
    this.memoryData.orders = [
      {
        _id: 'ord_demo_001',
        orderId: 'NAT-20261113-1001',
        user: 'usr_demo_002',
        customerName: 'Elena Vance',
        customerEmail: 'elena@naturalis.com',
        customerPhone: '+91 91234 56789',
        orderItems: [
          {
            product: 'prod_nat_001',
            name: 'Rosehip & Jojoba Radiant Face Oil',
            qty: 1,
            price: 34.99,
            image: this.memoryData.products[0].image,
          },
          {
            product: 'prod_nat_004',
            name: 'High-Altitude French Lavender Calming Essential Oil',
            qty: 1,
            price: 19.50,
            image: this.memoryData.products[3].image,
          },
        ],
        shippingAddress: {
          street: '45 Green Meadow Lane',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          postalCode: '641001',
          country: 'India',
        },
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        itemsPrice: 54.49,
        shippingPrice: 0,
        discountPrice: 5.0,
        totalPrice: 49.49,
        orderStatus: 'Shipped',
        trackingTimeline: [
          {
            status: 'Placed',
            title: 'Order Confirmed',
            description: 'Your pure organic order has been verified and received.',
            location: 'Eco Botanical Center',
            timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
            completed: true,
          },
          {
            status: 'Processing',
            title: 'Formulation & QC Passed',
            description: 'Items inspected for batch freshness and natural purity.',
            location: 'Central Apothecary Lab',
            timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
            completed: true,
          },
          {
            status: 'Packed',
            title: 'Eco-Friendly Packaged',
            description: 'Carefully wrapped in biodegradable honeycomb paper and sealed with organic wax.',
            location: 'Zero-Waste Fulfillment Center',
            timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
            completed: true,
          },
          {
            status: 'Shipped',
            title: 'In Transit with Green Courier',
            description: 'Dispatched on low-emission route towards your city destination.',
            location: 'Regional Botanical Hub',
            timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
            completed: true,
          },
          {
            status: 'Out for Delivery',
            title: 'Out for Delivery',
            description: 'Courier agent will deliver by today evening.',
            location: 'Coimbatore Local Delivery Station',
            timestamp: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
            completed: false,
          },
          {
            status: 'Delivered',
            title: 'Delivered',
            description: 'Package handed over to recipient.',
            location: 'Customer Address',
            timestamp: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
            completed: false,
          },
        ],
        estimatedDelivery: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      },
    ];

    this.memoryData.contacts = [
      {
        _id: 'cnt_001',
        name: 'Aria Sharma',
        email: 'aria@example.com',
        subject: 'Wholesale & Eco-friendly Gifting',
        message: 'Hello, do you offer customized organic skincare gift sets for corporate wellness events?',
        status: 'New',
        createdAt: new Date().toISOString(),
      },
    ];

    this.save();
  }
}

const dbStoreInstance = new DbStore();
module.exports = dbStoreInstance;
