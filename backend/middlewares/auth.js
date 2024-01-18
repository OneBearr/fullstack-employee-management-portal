const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product')

const authenticate = async (req, res, next) => {
  // Get token from header
  const token =
    req.header('x-auth-token') ||
    req.headers?.authorization?.match(/^Bearer (.+)/)[1];

  // req.header { authorization: 'Bearer hureuiwe.bhuerer.duwwe' }

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    // Verify token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // Add user from payload
    req.user = decoded.user;

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    console.log(`In isAdmin: User id: ${user.id}`);
    req.user = user;
    if (!user.isAdmin) {
      res.status(401).json({ message: "You are not an Admin!" });
      return;
    }

    next();
    return;
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const isOwner = async (req, res, next) => {
  try {
    const user = req.user;
    const product = await Product.findById(req.params?.id);

    console.log(`In isOwner: User id: ${user.id}, Product id: ${product.id}, Product owner: ${product?.owner}`);

    if (product?.owner?.toString() !== user.id.toString()) {
      res.status(401).json({ message: "You are not the owner of this item!" });
      return;
    }
    next();
    return;
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = {
  authenticate,
  isAdmin,
  isOwner
}