const jwt = require('jsonwebtoken');
const User = require('../models/user');
const APIError = require('../errors');

const authenticate = async (req, res, next) => {
  // Get token from header
  const token =
    req.header('x-auth-token') ||
    req.headers?.authorization?.match(/^Bearer (.+)/)[1];

  // req.header { authorization: 'Bearer hureuiwe.bhuerer.duwwe' }

  // Check if token exists
  if (!token) {
    return next(new APIError('No token, authorization denied', 401));
  }
  try {
    // Verify token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // Add user from payload
    req.user = decoded.user;

    next();
  } catch (err) {
    console.error(err);
    return next(new APIError('Token is not valid', 401));
  }
};

const isHR = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new APIError("No such user!", 400));
    }
    console.log(`In isHR: User id: ${user.id}`);
    req.user = user;
    if (!user.isHR) {
      return next(new APIError("You are not an HR!", 401));
    }

    next();
    return;
  } catch (error) {
    console.error(error);
    return next(new APIError(error.message, 500));
  }
};

module.exports = {
  authenticate,
  isHR
}