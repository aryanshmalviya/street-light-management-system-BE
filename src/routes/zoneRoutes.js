const express = require('express');
const { body } = require('express-validator');
const zoneController = require('../controllers/zoneController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// router.use(authMiddleware);

router.get('/', zoneController.getAllZones);

router.get('/:id', zoneController.getZoneById);

router.post('/', [
  body('zone_name').isString().notEmpty(),
], zoneController.createZone);

router.put('/:id', zoneController.updateZone);

router.delete('/:id', zoneController.deleteZone);

router.get('/:id/stats', zoneController.getZoneStats);

module.exports = router;
