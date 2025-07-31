const jwt = require('jsonwebtoken');

// Generate JWT token
exports.generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Verify JWT token
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid token');
  }
};

// Extract token from authorization header
exports.extractToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return null;
  }
  return authHeader.split(' ')[1];
};

// Generate refresh token (for future implementation)
exports.generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: '7d' // Refresh token valid for 7 days
  });
};

// Verify refresh token (for future implementation)
exports.verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid refresh token');
  }
};

// Token blacklist (for future implementation of logout)
const tokenBlacklist = new Set();

// Add token to blacklist
exports.blacklistToken = (token) => {
  tokenBlacklist.add(token);
};

// Check if token is blacklisted
exports.isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};

// Clean up expired tokens from blacklist (should be called periodically)
exports.cleanupBlacklist = () => {
  tokenBlacklist.forEach(token => {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Token is expired, remove from blacklist
      tokenBlacklist.delete(token);
    }
  });
};