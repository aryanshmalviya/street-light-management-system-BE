const express = require('express');
const { body } = require('express-validator');
const streetLightController = require('../controllers/streetLightController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', streetLightController.getAllLights);
router.get('/:id', streetLightController.getLightById);

router.post(
  '/',
  [
    body('light_id').notEmpty().withMessage('light_id is required'),
    body('section_id').isInt().withMessage('section_id must be an integer'),
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
