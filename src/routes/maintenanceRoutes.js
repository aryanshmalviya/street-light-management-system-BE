const express = require('express');
const maintenanceController = require('../controllers/maintenanceController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/schedule', maintenanceController.scheduleMaintenance);
router.get('/pending', maintenanceController.getPendingMaintenance);
router.get('/history', maintenanceController.getMaintenanceHistory);
router.patch('/:maintenanceId/complete', maintenanceController.completeMaintenance);
router.get('/stats', maintenanceController.getMaintenanceStatistics);

module.exports = router;
