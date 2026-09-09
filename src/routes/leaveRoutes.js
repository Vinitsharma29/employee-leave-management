const express = require('express');
const leaveController = require('../controllers/leaveController');

const router = express.Router();

router.post('/', leaveController.submitLeave);
router.get('/', leaveController.getLeaves);
router.patch('/:id/status', leaveController.updateStatus);
router.get('/summary/:employee_id', leaveController.getSummary);

module.exports = router;
