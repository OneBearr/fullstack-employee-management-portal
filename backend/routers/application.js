const express = require('express');
const {
    getAllApplication,
    getOneApplication,
    createApplication,
    updateApplication
} = require('../controllers/application');

const router = express.Router();

// api/applications
router.get('/', getAllApplication);

// api/applications/:uid
router.get('/:uid', getOneApplication);
router.post('/:uid', createApplication);
router.put('/:uid', updateApplication);


module.exports = router;
