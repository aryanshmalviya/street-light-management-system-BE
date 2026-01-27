const express = require('express');
const { body, query } = require('express-validator');
const telemetryController = require('../controllers/telemetryController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /telemetry/pole/{poleId}:
 *   get:
 *     summary: Get telemetry data for a pole
 *     tags: [Telemetry]
 *     parameters:
 *       - in: path
 *         name: poleId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *     responses:
 *       200:
 *         description: List of telemetry records
 *       404:
 *         description: No data found
 */
router.get('/pole/:poleId', telemetryController.getTelemetryByPole);

/**
 * @swagger
 * /telemetry/{id}:
 *   get:
 *     summary: Get specific telemetry record
 *     tags: [Telemetry]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Telemetry record details
 *       404:
 *         description: Record not found
 */
router.get('/:id', telemetryController.getTelemetryById);

/**
 * @swagger
 * /telemetry:
 *   post:
 *     summary: Record new telemetry data
 *     tags: [Telemetry]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - telemetry_id
 *               - pole_id
 *               - ts
 *               - state
 *             properties:
 *               telemetry_id:
 *                 type: string
 *               pole_id:
 *                 type: string
 *               ts:
 *                 type: string
 *                 format: date-time
 *               state:
 *                 type: string
 *               voltage:
 *                 type: number
 *               current_a:
 *                 type: number
 *               power_w:
 *                 type: number
 *               energy_kwh:
 *                 type: number
 *               ambient_lux:
 *                 type: number
 *               temperature_c:
 *                 type: number
 *               dimming_level:
 *                 type: integer
 *               fault_code:
 *                 type: string
 *     responses:
 *       201:
 *         description: Telemetry recorded successfully
 *       400:
 *         description: Validation error
 */
router.post('/', [
  body('telemetry_id').isString().notEmpty(),
  body('pole_id').isString().notEmpty(),
  body('ts').isISO8601(),
  body('state').isString().notEmpty(),
], telemetryController.recordTelemetry);

/**
 * @swagger
 * /telemetry/pole/{poleId}/latest:
 *   get:
 *     summary: Get latest telemetry for a pole
 *     tags: [Telemetry]
 *     parameters:
 *       - in: path
 *         name: poleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Latest telemetry record
 *       404:
 *         description: No data found
 */
router.get('/pole/:poleId/latest', telemetryController.getLatestTelemetry);

/**
 * @swagger
 * /telemetry/pole/{poleId}/range:
 *   get:
 *     summary: Get telemetry for time range
 *     tags: [Telemetry]
 *     parameters:
 *       - in: path
 *         name: poleId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: startTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Telemetry records in time range
 */
router.get('/pole/:poleId/range', telemetryController.getTelemetryRange);

/**
 * @swagger
 * /telemetry/pole/{poleId}/stats:
 *   get:
 *     summary: Get power usage statistics
 *     tags: [Telemetry]
 *     parameters:
 *       - in: path
 *         name: poleId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: hours
 *         schema:
 *           type: integer
 *           default: 24
 *     responses:
 *       200:
 *         description: Power usage statistics
 */
router.get('/pole/:poleId/stats', telemetryController.getAveragePowerUsage);

module.exports = router;
