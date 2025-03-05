const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).json({ message: 'Access Denied. No Token Provided.' });
        }

        const tokenParts = authHeader.split(' ');
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return res.status(401).json({ message: 'Invalid Authorization Format. Use "Bearer <token>"' });
        }

        const token = tokenParts[1]; 

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = decoded.userId;

        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or Expired Token', error: error.message });
    }
};

module.exports = authMiddleware;
