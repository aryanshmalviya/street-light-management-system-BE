const express = require('express');
const { body } = require('express-validator');
const zoneController = require('../controllers/zoneController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /zones:
 *   get:
 *     summary: Get all zones
 *     tags: [Zones]
 *     responses:
 *       200:
 *         description: List of all zones
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
 *                     $ref: '#/components/schemas/Zone'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', zoneController.getAllZones);

/**
 * @swagger
 * /zones/{id}:
 *   get:
 *     summary: Get zone by ID
 *     tags: [Zones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Zone ID
 *     responses:
 *       200:
 *         description: Zone details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Zone'
 *       404:
 *         description: Zone not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', zoneController.getZoneById);

/**
 * @swagger
 * /zones:
 *   post:
 *     summary: Create a new zone
 *     tags: [Zones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - zone_id
 *               - name
 *             properties:
 *               zone_id:
 *                 type: string
 *               name:
 *                 type: string
 *               length_km:
 *                 type: number
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               poles:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Zone created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', [
  body('zone_id').isString().notEmpty(),
  body('name').isString().notEmpty(),
], zoneController.createZone);

/**
 * @swagger
 * /zones/{id}:
 *   put:
 *     summary: Update zone
 *     tags: [Zones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               length_km:
 *                 type: number
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               poles:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Zone updated successfully
 *       404:
 *         description: Zone not found
 */
router.put('/:id', zoneController.updateZone);

/**
 * @swagger
 * /zones/{id}:
 *   delete:
 *     summary: Delete zone
 *     tags: [Zones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Zone deleted successfully
 *       404:
 *         description: Zone not found
 */
router.delete('/:id', zoneController.deleteZone);

/**
 * @swagger
 * /zones/{id}/stats:
 *   get:
 *     summary: Get zone statistics
 *     tags: [Zones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Zone statistics
 *       404:
 *         description: Zone not found
 */
router.get('/:id/stats', zoneController.getZoneStats);

module.exports = router;
