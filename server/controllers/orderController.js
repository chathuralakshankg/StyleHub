const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingDetails,
      paymentMethod,
      user,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // 1. Calculate price from backend and reduce stock
    let calculatedTotalPrice = 0;
    
    // We must process items sequentially to properly check/update stock 
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }

      // Find the specific variant
      const variantIndex = product.variants.findIndex(
        (v) => v.size === item.variant.size && (item.variant.color ? v.color === item.variant.color : true)
      );

      if (variantIndex === -1) {
        return res.status(400).json({ message: `Variant not found for ${item.name}` });
      }

      const variant = product.variants[variantIndex];

      if (variant.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.name} (${variant.size}${variant.color ? ' - ' + variant.color : ''})` });
      }

      // Calculate price securely
      calculatedTotalPrice += product.price * item.quantity;
      
      // Update item price securely for the order record
      item.price = product.price;

      // Reduce stock
      product.variants[variantIndex].stock -= item.quantity;
      await product.save();
    }

    // 2. Create Order
    const order = new Order({
      orderItems,
      shippingDetails,
      paymentMethod,
      paymentStatus: paymentMethod === 'Card Payment' ? 'Paid' : 'Pending',
      totalPrice: calculatedTotalPrice,
      user: user || null,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get My Orders Error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .populate('orderItems.product', 'category')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get Orders Error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    
    const order = await Order.findById(req.params.id);

    if (order) {
      if (orderStatus) order.orderStatus = orderStatus;
      if (paymentStatus) order.paymentStatus = paymentStatus;

      const updatedOrder = await order.save();
      
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Update Order Status Error:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus,
};
