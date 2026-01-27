const express = require('express');
const faultDetectionController = require('../controllers/faultDetectionController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /faults/report:
 *   post:
 *     summary: Report a fault for a street light
 *     tags: [Fault Detection]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - light_id
 *               - fault_type
 *               - severity
 *             properties:
 *               light_id:
 *                 type: integer
 *                 description: Street light ID
 *               fault_type:
 *                 type: string
 *                 enum: [lamp_failure, power_loss, circuit_fault, sensor_failure]
 *               severity:
 *                 type: string
 *                 enum: [low, medium, high, critical]
 *               description:
 *                 type: string
 *                 description: Detailed fault description
 *     responses:
 *       201:
 *         description: Fault reported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/FaultDetection'
 *       401:
 *         description: Unauthorized
 */
router.post('/report', faultDetectionController.reportFault);

/**
 * @swagger
 * /faults/open:
 *   get:
 *     summary: Get all open faults
 *     tags: [Fault Detection]
 *     responses:
 *       200:
 *         description: List of open faults
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
 *                     $ref: '#/components/schemas/FaultDetection'
 *       401:
 *         description: Unauthorized
 */
router.get('/open', faultDetectionController.getOpenFaults);

/**
 * @swagger
 * /faults/{lightId}:
 *   get:
 *     summary: Get faults for a specific light
 *     tags: [Fault Detection]
 *     parameters:
 *       - in: path
 *         name: lightId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Street light ID
 *     responses:
 *       200:
 *         description: List of faults for the light
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
 *                     $ref: '#/components/schemas/FaultDetection'
 *       401:
 *         description: Unauthorized
 */
router.get('/:lightId', faultDetectionController.getFaultsByLight);

/**
 * @swagger
 * /faults/{faultId}/resolve:
 *   patch:
 *     summary: Resolve a fault
 *     tags: [Fault Detection]
 *     parameters:
 *       - in: path
 *         name: faultId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Fault ID
 *     responses:
 *       200:
 *         description: Fault resolved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/FaultDetection'
 *       401:
 *         description: Unauthorized
 */
router.patch('/:faultId/resolve', faultDetectionController.resolveFault);

/**
 * @swagger
 * /faults/section/stats:
 *   get:
 *     summary: Get fault statistics for a section
 *     tags: [Fault Detection]
 *     parameters:
 *       - in: query
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Highway section ID
 *     responses:
 *       200:
 *         description: Fault statistics
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
 *                     total_faults:
 *                       type: integer
 *                     open_faults:
 *                       type: integer
 *                     resolved_faults:
 *                       type: integer
 *                     critical_faults:
 *                       type: integer
 *       400:
 *         description: sectionId is required
 *       401:
 *         description: Unauthorized
 */
router.get('/section/stats', faultDetectionController.getFaultStatistics);

module.exports = router;
