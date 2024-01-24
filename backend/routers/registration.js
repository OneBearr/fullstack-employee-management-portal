const express = require('express');
const {
    getHistory
} = require('../controllers/registrationToken');

const router = express.Router();

// api/registrations
router.get('/', getHistory);

module.exports = router;
