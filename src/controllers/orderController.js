const OrderService = require('../services/orderService');
const { validationResult } = require('express-validator');

class OrderController {
  static async createOrder(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { items } = req.body;
      const userId = req.user.userId;

      const order = await OrderService.createOrder(userId, items);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getOrder(req, res) {
    try {
      const orderId = req.params.id;
      const order = await OrderService.getOrder(orderId);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (order.userId.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Unauthorized access to order' });
      }

      res.json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = OrderController;