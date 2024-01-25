const express = require('express');
const {
    getVisaStatusByUID,
    getAllVisaStatus,
    approveVisaStatus,
    rejectVisaStatus
} = require('../controllers/visaStatus');
const { authenticate, isHR } = require('../middlewares/auth')
const router = express.Router();

// api/hrVisaStatus
router.get('/', authenticate, isHR, getAllVisaStatus);
router.get('/:uid', authenticate, isHR, getVisaStatusByUID);

router.put('/reject/:uid', authenticate, isHR, rejectVisaStatus);
router.put('/approve/:uid', authenticate, isHR, approveVisaStatus);

module.exports = router;
