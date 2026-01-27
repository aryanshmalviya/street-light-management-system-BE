const express = require('express');
const monitoringController = require('../controllers/monitoringController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /monitoring/record:
 *   post:
 *     summary: Record real-time monitoring data
 *     tags: [Monitoring]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - light_id
 *             properties:
 *               light_id:
 *                 type: integer
 *                 description: Street light ID
 *               status:
 *                 type: string
 *                 enum: [on, off, dimmed]
 *               power_consumption:
 *                 type: number
 *                 description: Power consumption in watts
 *               voltage:
 *                 type: number
 *                 description: Voltage in volts
 *               current:
 *                 type: number
 *                 description: Current in amperes
 *               brightness_level:
 *                 type: integer
 *                 description: Brightness level 0-100
 *               temperature:
 *                 type: number
 *                 description: Temperature in celsius
 *     responses:
 *       201:
 *         description: Monitoring data recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/MonitoringData'
 *       401:
 *         description: Unauthorized
 */
router.post('/record', monitoringController.recordMonitoringData);

/**
 * @swagger
 * /monitoring/{lightId}/latest:
 *   get:
 *     summary: Get latest monitoring data for a light
 *     tags: [Monitoring]
 *     parameters:
 *       - in: path
 *         name: lightId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Street light ID
 *     responses:
 *       200:
 *         description: Latest monitoring data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/MonitoringData'
 *       404:
 *         description: No monitoring data found
 *       401:
 *         description: Unauthorized
 */
router.get('/:lightId/latest', monitoringController.getLatestMonitoringData);

/**
 * @swagger
 * /monitoring/{lightId}/range:
 *   get:
 *     summary: Get monitoring data for a light within date range
 *     tags: [Monitoring]
 *     parameters:
 *       - in: path
 *         name: lightId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Street light ID
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for data range
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for data range
 *     responses:
 *       200:
 *         description: Monitoring data for date range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MonitoringData'
 *       401:
 *         description: Unauthorized
 */
router.get('/:lightId/range', monitoringController.getMonitoringDataRange);

/**
 * @swagger
 * /monitoring/section/status:
 *   get:
 *     summary: Get all lights status for a section
 *     tags: [Monitoring]
 *     parameters:
 *       - in: query
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Highway section ID
 *     responses:
 *       200:
 *         description: Status of all lights in section
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MonitoringData'
 *       400:
 *         description: sectionId is required
 *       401:
 *         description: Unauthorized
 */
router.get('/section/status', monitoringController.getAllLightsStatus);

module.exports = router;
