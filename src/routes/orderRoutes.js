const express = require('express');
const { body } = require('express-validator');
const OrderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all order routes
router.use(authMiddleware);

router.post('/', [
  body('items').isArray().notEmpty(),
  body('items.*.productId').notEmpty(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('items.*.price').isFloat({ min: 0 })
], OrderController.createOrder);

router.get('/:id', OrderController.getOrder);

module.exports = router;