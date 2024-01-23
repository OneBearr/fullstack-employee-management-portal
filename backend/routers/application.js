const express = require('express');
const {
    getAllApplication,
    getOneApplication,
    createApplication,
    updateApplication
} = require('../controllers/application');
const { authenticate, isOwner } = require('../middlewares/auth')

const router = express.Router();

// api/applications
router.get('/', getAllApplication);

// api/applications/:uid
router.get('/:uid', authenticate, isOwner, getOneApplication);
router.post('/:uid', authenticate, isOwner, createApplication);
router.put('/:uid', authenticate, isOwner, updateApplication);


module.exports = router;
