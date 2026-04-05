import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

// 1. Verify JWT Token
export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user || req.user.status === 'inactive') {
      return res.status(401).json({ message: 'User not found or account inactive' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token failed' });
  }
};

// 2. Check Roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Role ${req.user.role} is not authorized to access this resource` 
      });
    }
    next();
  };
};