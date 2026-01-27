const express = require('express');
const carbonTrackingController = require('../controllers/carbonTrackingController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /carbon/record:
 *   post:
 *     summary: Record carbon footprint data
 *     tags: [Carbon Tracking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - section_id
 *               - date
 *               - energy_consumed_kwh
 *             properties:
 *               section_id:
 *                 type: integer
 *                 description: Highway section ID
 *               date:
 *                 type: string
 *                 format: date
 *               energy_consumed_kwh:
 *                 type: number
 *                 description: Energy consumed in kWh
 *               co2_emissions_kg:
 *                 type: number
 *                 description: CO2 emissions in kg
 *               carbon_credits:
 *                 type: number
 *                 description: Carbon credits earned
 *               baseline_consumption:
 *                 type: number
 *                 description: Baseline for comparison
 *               reduction_percentage:
 *                 type: number
 *                 description: Reduction percentage from baseline
 *     responses:
 *       201:
 *         description: Carbon data recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CarbonTracking'
 *       401:
 *         description: Unauthorized
 */
router.post('/record', carbonTrackingController.recordCarbonFootprint);

/**
 * @swagger
 * /carbon/report:
 *   get:
 *     summary: Get carbon footprint report for date range
 *     tags: [Carbon Tracking]
 *     parameters:
 *       - in: query
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Highway section ID
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Carbon footprint report
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
 *                     total_energy_kwh:
 *                       type: number
 *                     total_co2_kg:
 *                       type: number
 *                     total_carbon_credits:
 *                       type: number
 *                     avg_reduction_percentage:
 *                       type: number
 *       400:
 *         description: sectionId, startDate, and endDate are required
 *       401:
 *         description: Unauthorized
 */
router.get('/report', carbonTrackingController.getCarbonReport);

/**
 * @swagger
 * /carbon/daily:
 *   get:
 *     summary: Get daily carbon data
 *     tags: [Carbon Tracking]
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
 *     responses:
 *       200:
 *         description: Daily carbon data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CarbonTracking'
 *       404:
 *         description: No carbon data found for this date
 *       400:
 *         description: sectionId and date are required
 *       401:
 *         description: Unauthorized
 */
router.get('/daily', carbonTrackingController.getDailyCarbonData);

/**
 * @swagger
 * /carbon/trends:
 *   get:
 *     summary: Get monthly carbon trends
 *     tags: [Carbon Tracking]
 *     parameters:
 *       - in: query
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Highway section ID
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Number of months to retrieve
 *     responses:
 *       200:
 *         description: Monthly carbon trends
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
 *                       month:
 *                         type: string
 *                         format: date-time
 *                       total_energy_kwh:
 *                         type: number
 *                       total_co2_kg:
 *                         type: number
 *                       total_carbon_credits:
 *                         type: number
 *       400:
 *         description: sectionId is required
 *       401:
 *         description: Unauthorized
 */
router.get('/trends', carbonTrackingController.getMonthlyCarbonTrends);

/**
 * @swagger
 * /carbon/impact:
 *   get:
 *     summary: Get environmental impact summary
 *     tags: [Carbon Tracking]
 *     parameters:
 *       - in: query
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Highway section ID
 *     responses:
 *       200:
 *         description: Environmental impact data
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
 *                     total_energy_saved_kwh:
 *                       type: number
 *                     total_co2_avoided_kg:
 *                       type: number
 *                     total_carbon_credits_earned:
 *                       type: number
 *                     days_tracked:
 *                       type: integer
 *       400:
 *         description: sectionId is required
 *       401:
 *         description: Unauthorized
 */
router.get('/impact', carbonTrackingController.getEnvironmentalImpact);

module.exports = router;
