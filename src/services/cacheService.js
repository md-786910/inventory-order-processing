const { getAsync, setAsync } = require('../config/database');

class CacheService {
  static async getOrder(orderId) {
    const cached = await getAsync(`order:${orderId}`);
    return cached ? JSON.parse(cached) : null;
  }

  static async setOrder(orderId, order) {
    await setAsync(
      `order:${orderId}`,
      JSON.stringify(order),
      'EX',
      600 // 10 minutes expiration
    );
  }

  static async invalidateOrder(orderId) {
    await delAsync(`order:${orderId}`);
  }
}

module.exports = CacheService;