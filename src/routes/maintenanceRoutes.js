const express = require('express');
const maintenanceController = require('../controllers/maintenanceController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /maintenance/schedule:
 *   post:
 *     summary: Schedule maintenance for a light or section
 *     tags: [Maintenance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - section_id
 *               - maintenance_type
 *               - scheduled_date
 *             properties:
 *               light_id:
 *                 type: integer
 *                 description: Street light ID (optional)
 *               section_id:
 *                 type: integer
 *                 description: Highway section ID
 *               maintenance_type:
 *                 type: string
 *                 enum: [preventive, corrective, emergency]
 *               scheduled_date:
 *                 type: string
 *                 format: date-time
 *               assigned_to:
 *                 type: integer
 *                 description: User ID of assigned technician
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Maintenance scheduled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Maintenance'
 *       401:
 *         description: Unauthorized
 */
router.post('/schedule', maintenanceController.scheduleMaintenance);

/**
 * @swagger
 * /maintenance/pending:
 *   get:
 *     summary: Get pending maintenance tasks
 *     tags: [Maintenance]
 *     parameters:
 *       - in: query
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Highway section ID
 *     responses:
 *       200:
 *         description: List of pending maintenance tasks
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
 *                     $ref: '#/components/schemas/Maintenance'
 *       400:
 *         description: sectionId is required
 *       401:
 *         description: Unauthorized
 */
router.get('/pending', maintenanceController.getPendingMaintenance);

/**
 * @swagger
 * /maintenance/history:
 *   get:
 *     summary: Get maintenance history
 *     tags: [Maintenance]
 *     parameters:
 *       - in: query
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Highway section ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of records to retrieve
 *     responses:
 *       200:
 *         description: Maintenance history
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
 *                     $ref: '#/components/schemas/Maintenance'
 *       400:
 *         description: sectionId is required
 *       401:
 *         description: Unauthorized
 */
router.get('/history', maintenanceController.getMaintenanceHistory);

/**
 * @swagger
 * /maintenance/{maintenanceId}/complete:
 *   patch:
 *     summary: Mark maintenance as completed
 *     tags: [Maintenance]
 *     parameters:
 *       - in: path
 *         name: maintenanceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Maintenance schedule ID
 *     responses:
 *       200:
 *         description: Maintenance marked as completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Maintenance'
 *       401:
 *         description: Unauthorized
 */
router.patch('/:maintenanceId/complete', maintenanceController.completeMaintenance);

/**
 * @swagger
 * /maintenance/stats:
 *   get:
 *     summary: Get maintenance statistics
 *     tags: [Maintenance]
 *     parameters:
 *       - in: query
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Highway section ID
 *     responses:
 *       200:
 *         description: Maintenance statistics
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
 *                     total_schedules:
 *                       type: integer
 *                     pending:
 *                       type: integer
 *                     completed:
 *                       type: integer
 *                     in_progress:
 *                       type: integer
 *       400:
 *         description: sectionId is required
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', maintenanceController.getMaintenanceStatistics);

module.exports = router;
