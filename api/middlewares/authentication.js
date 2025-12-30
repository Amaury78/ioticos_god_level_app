const jwt = require('jsonwebtoken');
require('dotenv').config();

// Get JWT secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET;

// Validate JWT_SECRET exists and is secure
if (!JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
    process.exit(1);
}

if (JWT_SECRET.length < 32) {
    console.error('FATAL ERROR: JWT_SECRET must be at least 32 characters long for security.');
    process.exit(1);
}

let checkAuth = (req, res, next) => {
    // Get token from header
    let token = req.get('token');

    // Check if token exists
    if (!token) {
        return res.status(401).json({
            status: "error",
            error: "No token provided"
        });
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: "error",
                error: "Invalid or expired token"
            });
        }

        // Attach user data to request
        req.userData = decoded.userData;

        next();
    });
}

module.exports = { checkAuth }