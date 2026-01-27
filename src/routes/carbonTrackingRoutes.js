const express = require('express');
const carbonTrackingController = require('../controllers/carbonTrackingController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/record', carbonTrackingController.recordCarbonFootprint);
router.get('/report', carbonTrackingController.getCarbonReport);
router.get('/daily', carbonTrackingController.getDailyCarbonData);
router.get('/trends', carbonTrackingController.getMonthlyCarbonTrends);
router.get('/impact', carbonTrackingController.getEnvironmentalImpact);

module.exports = router;
