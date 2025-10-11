// middlewares/authorization.js

const authorize = (roles = []) => {
    if (typeof roles === 'string') {
      roles = [roles]; // Allow a single role string
    }
  
    return [
      (req, res, next) => {
        if (!req.user) {
          return res.status(401).json({ message: 'Unauthorized: Missing authentication token' });
        }
  
        if (roles.length && !roles.includes(req.user.role)) {
          return res.status(403).json({ message: 'Unauthorized: Insufficient role' });
        }
  
        next();
      },
    ];
  };
  
  module.exports = { authorize };