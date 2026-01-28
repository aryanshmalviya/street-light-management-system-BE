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

router.delete('/:id', streetLightController.deleteLight);

module.exports = router;
