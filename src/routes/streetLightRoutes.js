const express = require('express');
const { body } = require('express-validator');
const streetLightController = require('../controllers/streetLightController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// router.use(authMiddleware);

router.get('/', streetLightController.getAllLights);

router.get('/:id', streetLightController.getLightById);

router.post(
  '/',
  [
    body('pole_id').notEmpty().withMessage('pole_id is required'),
    body('zone_id').notEmpty().withMessage('zone_id is required'),
  ],
  streetLightController.createLight
);

router.patch(
  '/:id/status',
  [body('status').notEmpty().withMessage('status is required')],
  streetLightController.updateLightStatus
);

// New API: Control single pole (ON/OFF)
router.post(
  '/:poleId/control',
  [body('command').notEmpty().withMessage('command is required (ON or OFF)')],
  streetLightController.controlPole
);

// New API: Control all poles in a zone (ON/OFF)
router.post(
  '/zone/:zoneId/control',
  [body('command').notEmpty().withMessage('command is required (ON or OFF)')],
  streetLightController.controlZone
);

router.delete('/:id', streetLightController.deleteLight);

module.exports = router;
