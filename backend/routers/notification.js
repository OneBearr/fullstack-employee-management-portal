const express = require('express');
const {
    sendNotificationByUID,
} = require('../controllers/notification');
const {
    authenticate,
    isHR
} = require('../middlewares/auth')
const router = express.Router();

// api/notification
router.post('/:uid', authenticate, isHR, sendNotificationByUID);

module.exports = router;
