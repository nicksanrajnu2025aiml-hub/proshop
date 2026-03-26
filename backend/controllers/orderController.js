import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      status: 'processing',
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'paid';
    order.paymentResult = {
      id: req.body.id || 'MANUAL_PAY',
      status: req.body.status || 'COMPLETED',
      update_time: req.body.update_time || new Date().toISOString(),
      email_address: req.body.email_address || '',
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'delivered';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Request a return for delivered order items
// @route   POST /api/orders/:id/returns
// @access  Private
const requestReturn = asyncHandler(async (req, res) => {
  const { itemIds = [], reason } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isOwner = order.user.toString() === req.user._id.toString();
  if (!isOwner && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized for this order');
  }

  if (!order.isDelivered || !order.deliveredAt) {
    res.status(400);
    throw new Error('Only delivered orders can be returned');
  }

  const now = new Date();
  const deliveredAt = new Date(order.deliveredAt);
  const daysSinceDelivery = (now - deliveredAt) / (1000 * 60 * 60 * 24);
  if (daysSinceDelivery > 10) {
    res.status(400);
    throw new Error('Return window closed (10 days after delivery)');
  }

  if (!Array.isArray(itemIds) || itemIds.length === 0) {
    res.status(400);
    throw new Error('Select at least one item to return');
  }

  if (!reason || !reason.trim()) {
    res.status(400);
    throw new Error('Return reason is required');
  }

  const alreadyPending = order.returnRequests?.some((reqItem) =>
    reqItem.status === 'pending' && reqItem.itemIds.some((id) => itemIds.includes(id.toString()))
  );

  if (alreadyPending) {
    res.status(400);
    throw new Error('A return request is already pending for selected items');
  }

  order.returnRequests = order.returnRequests || [];
  order.returnRequests.push({
    itemIds,
    reason,
    status: 'pending',
    requestedAt: new Date(),
  });

  const saved = await order.save();
  res.status(201).json(saved);
});

// @desc    Update return request status (admin)
// @route   PUT /api/orders/:id/returns/:returnId
// @access  Private/Admin
const updateReturnStatus = asyncHandler(async (req, res) => {
  const { status, responseNote } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const request = order.returnRequests?.id(req.params.returnId);

  if (!request) {
    res.status(404);
    throw new Error('Return request not found');
  }

  const allowedStatuses = ['pending', 'approved', 'rejected', 'received'];
  if (status && !allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid return status');
  }

  const previousStatus = request.status;
  request.status = status || request.status;
  request.responseNote = responseNote || request.responseNote;
  request.processedAt = new Date();

  if (previousStatus !== 'received' && request.status === 'received') {
    // Restock returned items once when they are marked as received
    await Promise.all(
      request.itemIds.map(async (productId) => {
        const orderItem = order.orderItems.find((item) =>
          item.product.toString() === productId.toString()
        );
        if (!orderItem) return;

        const product = await Product.findById(productId);
        if (product) {
          product.countInStock += orderItem.qty;
          await product.save();
        }
      })
    );
    order.status = 'returned';
  }

  const saved = await order.save();
  res.json(saved);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  requestReturn,
  updateReturnStatus,
};
