const express = require('express');
const faultDetectionController = require('../controllers/faultDetectionController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/report', faultDetectionController.reportFault);
router.get('/open', faultDetectionController.getOpenFaults);
router.get('/:lightId', faultDetectionController.getFaultsByLight);
router.patch('/:faultId/resolve', faultDetectionController.resolveFault);
router.get('/section/stats', faultDetectionController.getFaultStatistics);

module.exports = router;
