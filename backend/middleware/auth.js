const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ message: 'No authentication token, access denied' });

        const actualToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

        const verified = jwt.verify(actualToken, process.env.JWT_SECRET || 'secretkey');
        req.user = verified.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token verification failed, authorization denied' });
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }
        next();
    };
};

module.exports = { auth, restrictTo };
