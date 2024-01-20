const express = require('express');
const {
    getAllUsers,
} = require('../controllers/user');

const router = express.Router();

// api/users
router.get('/', getAllUsers);

module.exports = router;
