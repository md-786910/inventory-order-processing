const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret, jwtExpiresIn, jwtRefreshSecret, jwtRefreshExpiresIn } = require('../config/env');

class AuthService {
  static generateTokens(userId) {
    const accessToken = jwt.sign({ userId }, jwtSecret, { expiresIn: jwtExpiresIn });
    const refreshToken = jwt.sign({ userId }, jwtRefreshSecret, { expiresIn: jwtRefreshExpiresIn });
    return { accessToken, refreshToken };
  }

  static async register(email, password, name) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = new User({ email, password, name });
    await user.save();
    return this.generateTokens(user._id);
  }

  static async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    return this.generateTokens(user._id);
  }

  static async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, jwtRefreshSecret);
      return this.generateTokens(decoded.userId);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}

module.exports = AuthService;