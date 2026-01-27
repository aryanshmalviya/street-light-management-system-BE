const express = require('express');
const monitoringController = require('../controllers/monitoringController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/record', monitoringController.recordMonitoringData);
router.get('/:lightId/latest', monitoringController.getLatestMonitoringData);
router.get('/:lightId/range', monitoringController.getMonitoringDataRange);
router.get('/section/status', monitoringController.getAllLightsStatus);

module.exports = router;
