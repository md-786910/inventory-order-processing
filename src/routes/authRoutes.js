const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/authController');
const routerValidationRules = require('../middleware/validationRules');

const router = express.Router();

router.post('/register', authValidationRules.register, validate, AuthController.register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], AuthController.login);

router.post('/refresh', AuthController.refreshToken);

module.exports = router;