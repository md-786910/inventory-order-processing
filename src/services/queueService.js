const { sqs } = require('../config/aws');
const { awsSqsQueueUrl } = require('../config/env');

class QueueService {
  static async sendToQueue(message) {
    const params = {
      QueueUrl: awsSqsQueueUrl,
      MessageBody: JSON.stringify(message),
      MessageAttributes: {
        "MessageType": {
          DataType: "String",
          StringValue: "OrderProcessing"
        }
      }
    };

    try {
      await sqs.sendMessage(params).promise();
    } catch (error) {
      throw new Error(`Failed to send message to queue: ${error.message}`);
    }
  }

  static async receiveMessages(maxMessages = 10) {
    const params = {
      QueueUrl: awsSqsQueueUrl,
      MaxNumberOfMessages: maxMessages,
      WaitTimeSeconds: 20
    };

    try {
      const data = await sqs.receiveMessage(params).promise();
      return data.Messages || [];
    } catch (error) {
      throw new Error(`Failed to receive messages: ${error.message}`);
    }
  }

  static async deleteMessage(receiptHandle) {
    const params = {
      QueueUrl: awsSqsQueueUrl,
      ReceiptHandle: receiptHandle
    };

    try {
      await sqs.deleteMessage(params).promise();
    } catch (error) {
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  }
}

module.exports = QueueService;