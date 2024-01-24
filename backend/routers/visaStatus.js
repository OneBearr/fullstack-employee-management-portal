const express = require('express');
const {
    getVisaStatusByUID
} = require('../controllers/visaStatus');
const { authenticate, isOwner } = require('../middlewares/auth')
const router = express.Router();

// api/visaStatus
router.get('/:uid', authenticate, isOwner, getVisaStatusByUID);

module.exports = router;
