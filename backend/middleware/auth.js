const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nowaste-canteen-secret-key-2026';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired session token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'canteen_admin') {
    return res.status(403).json({ message: 'Access denied: Canteen Admin privileges required' });
  }
  next();
};

const signToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      canteenName: user.canteenName
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = {
  authenticate,
  requireAdmin,
  signToken
};
