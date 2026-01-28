const express = require('express');
const { body, query } = require('express-validator');
const telemetryController = require('../controllers/telemetryController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// router.use(authMiddleware);


router.get('/pole/:poleId', telemetryController.getTelemetryByPole);


// router.get('/:id', telemetryController.getTelemetryById);


// router.post('/', [
//   body('telemetry_id').isString().notEmpty(),
//   body('pole_id').isString().notEmpty(),
//   body('ts').isISO8601(),
//   body('state').isString().notEmpty(),
// ], telemetryController.recordTelemetry);


router.get('/pole/:poleId/latest', telemetryController.getLatestTelemetry);

router.get('/pole/:poleId/range', telemetryController.getTelemetryRange);


router.get('/pole/:poleId/stats', telemetryController.getAveragePowerUsage);

module.exports = router;
