const express = require('express');
const router = express.Router();
const {
  createOrder,
  trackOrderByOrderId,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, createOrder);
router.get('/track/:orderId', trackOrderByOrderId);
router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
