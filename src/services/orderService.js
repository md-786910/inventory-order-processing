const Order = require('../models/Order');
const InventoryService = require('./inventoryService');
const QueueService = require('./queueService');
const CacheService = require('./cacheService');

class OrderService {
  static async createOrder(userId, items) {
    // Validate stock availability
    await InventoryService.checkStock(items);

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const order = new Order({
      userId,
      items,
      totalAmount,
      status: 'Pending'
    });

    await order.save();

    // Cache the order
    await CacheService.setOrder(order._id, order);

    // Send to processing queue
    await QueueService.sendToQueue({
      orderId: order._id,
      userId,
      items
    });

    return order;
  }

  static async getOrder(orderId) {
    // Try to get from cache first
    const cachedOrder = await CacheService.getOrder(orderId);
    if (cachedOrder) {
      return cachedOrder;
    }

    // If not in cache, get from database
    const order = await Order.findById(orderId);
    if (order) {
      await CacheService.setOrder(orderId, order);
    }
    return order;
  }

  static async updateOrderStatus(orderId, status) {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (order) {
      await CacheService.setOrder(orderId, order);
    }

    return order;
  }
}

module.exports = OrderService;