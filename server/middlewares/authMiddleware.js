import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7);
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // For development/testing, allow unauthenticated access to certain endpoints
    const publicEndpoints = ['/api/courses/getCourses', '/api/assignments'];
    if (publicEndpoints.some(endpoint => req.originalUrl.includes(endpoint))) {
        console.log('Allowing unauthenticated access to:', req.originalUrl);
        return next();
    }

    if (!token) {
        console.log('No token found in request');
        return res.status(401).json({ message: 'Access token required' });
    }

    try {
        console.log('Token found, attempting to verify...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_for_development');
        console.log('Token decoded successfully:', decoded);

        console.log('Looking up user with ID:', decoded.userId);
        const user = await User.findById(decoded.userId);

        console.log('User lookup result:', user);

        if (!user) {
            console.log('User not found in database');
            return res.status(401).json({ message: 'User not found' });
        }

        console.log('User found:', user.name, 'Role:', user.role);
        req.user = user;
        req.userId = user._id;
        next();
    } catch (err) {
        console.log('JWT verification failed:', err.message);
        return res.status(403).json({ message: 'Invalid or expired jwt token !' });
    }
};

export default authenticate;