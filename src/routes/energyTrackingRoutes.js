const express = require('express');
const energyTrackingController = require('../controllers/energyTrackingController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /energy/record:
 *   post:
 *     summary: Record energy usage data
 *     tags: [Energy Tracking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - section_id
 *               - daily_consumption
 *               - date
 *             properties:
 *               section_id:
 *                 type: integer
 *                 description: Highway section ID
 *               light_id:
 *                 type: integer
 *                 description: Street light ID (optional)
 *               daily_consumption:
 *                 type: number
 *                 description: Daily consumption in kWh
 *               cost:
 *                 type: number
 *                 description: Cost in currency units
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Energy usage recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/EnergyUsage'
 *       401:
 *         description: Unauthorized
 */
router.post('/record', energyTrackingController.recordEnergyUsage);

/**
 * @swagger
 * /energy/daily:
 *   get:
 *     summary: Get daily energy usage
 *     tags: [Energy Tracking]
 *     parameters:
 *       - in: query
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Highway section ID
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date for energy data
 *     responses:
 *       200:
 *         description: Daily energy usage data
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
 *                     $ref: '#/components/schemas/EnergyUsage'
 *       400:
 *         description: sectionId and date are required
 *       401:
 *         description: Unauthorized
 */
router.get('/daily', energyTrackingController.getDailyEnergyUsage);

/**
 * @swagger
 * /energy/monthly:
 *   get:
 *     summary: Get monthly energy usage
 *     tags: [Energy Tracking]
 *     parameters:
 *       - in: query
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Highway section ID
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month (1-12)
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Year (YYYY)
 *     responses:
 *       200:
 *         description: Monthly energy usage statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_consumption:
 *                       type: number
 *                     total_cost:
 *                       type: number
 *                     avg_consumption:
 *                       type: number
 *                     days_recorded:
 *                       type: integer
 *       400:
 *         description: sectionId, month, and year are required
 *       401:
 *         description: Unauthorized
 */
router.get('/monthly', energyTrackingController.getMonthlyEnergyUsage);

/**
 * @swagger
 * /energy/trends:
 *   get:
 *     summary: Get energy consumption trends
 *     tags: [Energy Tracking]
 *     parameters:
 *       - in: query
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Highway section ID
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to retrieve
 *     responses:
 *       200:
 *         description: Energy consumption trends
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
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       daily_consumption:
 *                         type: number
 *                       daily_cost:
 *                         type: number
 *       400:
 *         description: sectionId is required
 *       401:
 *         description: Unauthorized
 */
router.get('/trends', energyTrackingController.getEnergyTrends);

module.exports = router;
