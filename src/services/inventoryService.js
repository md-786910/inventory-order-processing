const Inventory = require('../models/Inventory');

class InventoryService {
  static async checkStock(items) {
    for (const item of items) {
      const product = await Inventory.findById(item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      if (!product.hasEnoughStock(item.quantity)) {
        throw new Error(`Insufficient stock for product ${product.productName}`);
      }
    }
    return true;
  }

  static async updateStock(items) {
    const updates = items.map(item => {
      return Inventory.findByIdAndUpdate(
        item.productId,
        { $inc: { stockQuantity: -item.quantity } },
        { new: true }
      );
    });
    return Promise.all(updates);
  }

  static async getProduct(productId) {
    return Inventory.findById(productId);
  }
}

module.exports = InventoryService;