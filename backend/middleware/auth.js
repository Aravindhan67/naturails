const jwt = require('jsonwebtoken');
const dbStore = require('../data/dbStore');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'natural_organic_eco_super_secret_jwt_key_2026_modern'
      );

      if (dbStore.isMongoose) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        const found = dbStore.memoryData.users.find(
          (u) => u._id === decoded.id || u.email === decoded.email
        );
        if (found) {
          const { password, ...userWithoutPassword } = found;
          req.user = userWithoutPassword;
        }
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User not found or token expired' });
      }

      return next();
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
};

const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'natural_organic_eco_super_secret_jwt_key_2026_modern'
      );
      if (dbStore.isMongoose) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        const found = dbStore.memoryData.users.find(
          (u) => u._id === decoded.id || u.email === decoded.email
        );
        if (found) {
          const { password, ...userWithoutPassword } = found;
          req.user = userWithoutPassword;
        }
      }
    } catch (err) {
      // Continue as guest
    }
  }
  next();
};

module.exports = { protect, adminOnly, optionalAuth };
