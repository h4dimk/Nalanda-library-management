import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authenticate = (roles = []) => {
  return async (req, res, next) => {
    const token = req?.cookies?.access_token;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied' });
      }
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
};

export default authenticate;
