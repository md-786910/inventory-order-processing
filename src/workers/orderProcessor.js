const QueueService = require('../services/queueService');
const OrderService = require('../services/orderService');
const InventoryService = require('../services/inventoryService');
const EmailService = require('../services/emailService');
const User = require('../models/User');

class OrderProcessor {
  static async start() {
    console.log('Order processor worker started');
    while (true) {
      try {
        const messages = await QueueService.receiveMessages();
        
        for (const message of messages) {
          await this.processOrder(message);
          await QueueService.deleteMessage(message.ReceiptHandle);
        }
      } catch (error) {
        console.error('Error processing messages:', error);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retry
      }
    }
  }

  static async processOrder(message) {
    const orderData = JSON.parse(message.Body);
    try {
      // Update inventory
      await InventoryService.updateStock(orderData.items);

      // Update order status
      const order = await OrderService.updateOrderStatus(orderData.orderId, 'Processed');

      // Send confirmation email
      const user = await User.findById(orderData.userId);
      if (user) {
        await EmailService.sendOrderConfirmation(user.email, order);
      }

    } catch (error) {
      console.error(`Failed to process order ${orderData.orderId}:`, error);
      await OrderService.updateOrderStatus(orderData.orderId, 'Failed');
      
      // Implement retry logic here if needed
      throw error;
    }
  }
}

// Start the worker if this file is run directly
if (require.main === module) {
  require('../config/env');
  require('../config/database').connectDB()
    .then(() => {
      OrderProcessor.start()
        .catch(error => {
          console.error('Fatal error in order processor:', error);
          process.exit(1);
        });
    });
}

module.exports = OrderProcessor;