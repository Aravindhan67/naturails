const dbStore = require('../data/dbStore');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { generateOrderId } = require('../utils/orderIdGenerator');

// Initial tracking stages for natural goods
const createDefaultTimeline = () => {
  const now = new Date();
  return [
    {
      status: 'Placed',
      title: 'Order Confirmed',
      description: 'Your pure botanical order has been verified and received into our queue.',
      location: 'Eco Botanical Center',
      timestamp: now,
      completed: true,
    },
    {
      status: 'Processing',
      title: 'Formulation & Freshness QC',
      description: 'Items inspected for batch freshness and natural ingredient purity.',
      location: 'Central Apothecary Lab',
      timestamp: new Date(now.getTime() + 12 * 3600 * 1000),
      completed: false,
    },
    {
      status: 'Packed',
      title: 'Eco-Friendly Packaged',
      description: 'Carefully wrapped in biodegradable honeycomb paper and sealed with organic botanical wax.',
      location: 'Zero-Waste Fulfillment Hub',
      timestamp: new Date(now.getTime() + 24 * 3600 * 1000),
      completed: false,
    },
    {
      status: 'Shipped',
      title: 'In Transit with Green Courier',
      description: 'Dispatched via carbon-offset delivery network towards your destination.',
      location: 'Regional Hub',
      timestamp: new Date(now.getTime() + 48 * 3600 * 1000),
      completed: false,
    },
    {
      status: 'Out for Delivery',
      title: 'Out for Delivery',
      description: 'Courier partner is out on the route to deliver your package.',
      location: 'Local Delivery Station',
      timestamp: new Date(now.getTime() + 72 * 3600 * 1000),
      completed: false,
    },
    {
      status: 'Delivered',
      title: 'Delivered',
      description: 'Organic package delivered safely to your doorstep.',
      location: 'Customer Address',
      timestamp: new Date(now.getTime() + 84 * 3600 * 1000),
      completed: false,
    },
  ];
};

// @desc    Create new order (with unique Order ID)
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      customerName,
      customerEmail,
      customerPhone,
      notes,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items specified' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ message: 'Complete shipping address is required' });
    }

    // Calculate totals
    const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 50 ? 0 : 5.0; // Free shipping over $50
    const discountPrice = itemsPrice > 75 ? 5.0 : 0; // Natural welcome discount
    const totalPrice = Number((itemsPrice + shippingPrice - discountPrice).toFixed(2));

    // Generate unique Order ID
    const uniqueOrderId = generateOrderId();

    const timeline = createDefaultTimeline();
    const estimatedDelivery = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);

    const orderPayload = {
      orderId: uniqueOrderId,
      user: req.user ? req.user._id : undefined,
      customerName: customerName || (req.user ? req.user.name : 'Valued Customer'),
      customerEmail: customerEmail || (req.user ? req.user.email : 'customer@example.com'),
      customerPhone: customerPhone || (req.user ? req.user.phone : ''),
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      itemsPrice: Number(itemsPrice.toFixed(2)),
      shippingPrice,
      discountPrice,
      totalPrice,
      orderStatus: 'Placed',
      trackingTimeline: timeline,
      estimatedDelivery,
      notes: notes || '',
    };

    if (dbStore.isMongoose) {
      const order = await Order.create(orderPayload);

      // Decrement stock in MongoDB
      for (const item of orderItems) {
        if (item.product) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.qty },
          });
        }
      }

      return res.status(201).json(order);
    } else {
      const newOrder = {
        _id: `ord_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        ...orderPayload,
        createdAt: new Date().toISOString(),
      };

      dbStore.memoryData.orders.unshift(newOrder);

      // Decrement stock in memory store
      for (const item of orderItems) {
        const prod = dbStore.memoryData.products.find(
          (p) => p._id === item.product || p.name === item.name
        );
        if (prod && prod.stock >= item.qty) {
          prod.stock -= item.qty;
        }
      }

      dbStore.save();
      return res.status(201).json(newOrder);
    }
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ message: error.message || 'Error processing order' });
  }
};

// @desc    Track order by unique orderId
// @route   GET /api/orders/track/:orderId
const trackOrderByOrderId = async (req, res) => {
  try {
    const rawId = req.params.orderId.trim();

    if (dbStore.isMongoose) {
      const order = await Order.findOne({
        $or: [{ orderId: { $regex: new RegExp(`^${rawId}$`, 'i') } }, { _id: rawId.length === 24 ? rawId : null }],
      });

      if (!order) {
        return res.status(404).json({ message: `No order found with ID: ${rawId}` });
      }
      return res.json(order);
    } else {
      const order = dbStore.memoryData.orders.find(
        (o) =>
          o.orderId.toLowerCase() === rawId.toLowerCase() ||
          o._id.toLowerCase() === rawId.toLowerCase()
      );

      if (!order) {
        return res.status(404).json({ message: `No order found with ID: ${rawId}` });
      }
      return res.json(order);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tracking details' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const userEmail = req.user.email ? req.user.email.toLowerCase() : '';

    if (dbStore.isMongoose) {
      const orders = await Order.find({
        $or: [{ user: req.user._id }, { customerEmail: userEmail }],
      }).sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      const orders = dbStore.memoryData.orders.filter(
        (o) =>
          (o.user && o.user.toString() === userId) ||
          (o.customerEmail && o.customerEmail.toLowerCase() === userEmail)
      );
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(orders);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer orders' });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
const getAllOrders = async (req, res) => {
  try {
    if (dbStore.isMongoose) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      const orders = [...dbStore.memoryData.orders];
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(orders);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// @desc    Update order status & tracking (Admin)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, location } = req.body;

    const validStatuses = [
      'Placed',
      'Processing',
      'Packed',
      'Shipped',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    if (dbStore.isMongoose) {
      const order = await Order.findOne({
        $or: [{ _id: id.length === 24 ? id : null }, { orderId: id }],
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      order.orderStatus = status;

      // Mark matching timeline checkpoints
      const statusOrderIndex = validStatuses.indexOf(status);
      order.trackingTimeline.forEach((cp) => {
        const cpIndex = validStatuses.indexOf(cp.status);
        if (cpIndex <= statusOrderIndex) {
          cp.completed = true;
          if (cp.status === status) {
            cp.timestamp = new Date();
            if (location) cp.location = location;
            if (note) cp.description = note;
          }
        }
      });

      if (status === 'Delivered') {
        order.paymentStatus = 'Paid';
      }

      const updated = await order.save();
      return res.json(updated);
    } else {
      const order = dbStore.memoryData.orders.find((o) => o._id === id || o.orderId === id);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      order.orderStatus = status;

      const statusOrderIndex = validStatuses.indexOf(status);
      order.trackingTimeline.forEach((cp) => {
        const cpIndex = validStatuses.indexOf(cp.status);
        if (cpIndex <= statusOrderIndex) {
          cp.completed = true;
          if (cp.status === status) {
            cp.timestamp = new Date().toISOString();
            if (location) cp.location = location;
            if (note) cp.description = note;
          }
        }
      });

      if (status === 'Delivered') {
        order.paymentStatus = 'Paid';
      }

      dbStore.save();
      return res.json(order);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
};

module.exports = {
  createOrder,
  trackOrderByOrderId,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
