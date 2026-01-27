const express = require('express');
const energyTrackingController = require('../controllers/energyTrackingController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/record', energyTrackingController.recordEnergyUsage);
router.get('/daily', energyTrackingController.getDailyEnergyUsage);
router.get('/monthly', energyTrackingController.getMonthlyEnergyUsage);
router.get('/trends', energyTrackingController.getEnergyTrends);

module.exports = router;
