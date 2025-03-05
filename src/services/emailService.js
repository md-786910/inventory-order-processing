const { ses } = require('../config/aws');
const { awsSesFromEmail } = require('../config/env');

class EmailService {
  static async sendOrderConfirmation(userEmail, order) {
    const params = {
      Source: awsSesFromEmail,
      Destination: {
        ToAddresses: [userEmail]
      },
      Message: {
        Subject: {
          Data: `Order Confirmation #${order._id}`
        },
        Body: {
          Html: {
            Data: this.generateOrderEmailTemplate(order)
          }
        }
      }
    };

    try {
      await ses.sendEmail(params).promise();
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  static generateOrderEmailTemplate(order) {
    const itemsList = order.items
      .map(item => `
        <tr>
          <td>${item.productId}</td>
          <td>${item.quantity}</td>
          <td>$${item.price.toFixed(2)}</td>
        </tr>
      `)
      .join('');

    return `
      <html>
        <body>
          <h2>Order Confirmation</h2>
          <p>Order ID: ${order._id}</p>
          <p>Status: ${order.status}</p>
          <table border="1">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>
          <p>Total Amount: $${order.totalAmount.toFixed(2)}</p>
        </body>
      </html>
    `;
  }
}

module.exports = EmailService;