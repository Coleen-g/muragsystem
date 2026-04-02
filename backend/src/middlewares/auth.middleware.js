const jwt  = require('jsonwebtoken');
const User = require('../models/user.model');

exports.protect = async (req, res, next) => {
  try {
    // Accept token from Authorization header OR query param (needed for SSE/EventSource)
    const token =
      req.headers.authorization?.split(' ')[1] ||
      req.query.token;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};