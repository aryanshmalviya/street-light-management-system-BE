const express = require('express');
const { body } = require('express-validator');
const streetLightController = require('../controllers/streetLightController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /lights:
 *   get:
 *     summary: Get all street lights (assets)
 *     tags: [Street Lights]
 *     parameters:
 *       - in: query
 *         name: zoneId
 *         schema:
 *           type: string
 *         description: Filter by zone ID
 *     responses:
 *       200:
 *         description: List of all street lights
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
 *                     $ref: '#/components/schemas/Asset'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', streetLightController.getAllLights);

/**
 * @swagger
 * /lights/{id}:
 *   get:
 *     summary: Get street light by pole ID
 *     tags: [Street Lights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pole ID
 *     responses:
 *       200:
 *         description: Street light details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Asset'
 *       404:
 *         description: Light not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', streetLightController.getLightById);

/**
 * @swagger
 * /lights:
 *   post:
 *     summary: Create a new street light
 *     tags: [Street Lights]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pole_id
 *               - zone_id
 *             properties:
 *               pole_id:
 *                 type: string
 *                 description: Unique pole ID code
 *               zone_id:
 *                 type: string
 *                 description: Zone ID
 *               controller_id:
 *                 type: string
 *               fixture_type:
 *                 type: string
 *               installed_on:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *               gps_lat:
 *                 type: number
 *                 description: GPS latitude
 *               gps_lng:
 *                 type: number
 *                 description: GPS longitude
 *     responses:
 *       201:
 *         description: Street light created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Asset'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  [
    body('pole_id').notEmpty().withMessage('pole_id is required'),
    body('zone_id').notEmpty().withMessage('zone_id is required'),
  ],
  streetLightController.createLight
);

/**
 * @swagger
 * /lights/{id}/status:
 *   patch:
 *     summary: Update street light status
 *     tags: [Street Lights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pole ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [operational, faulty, maintenance, offline]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Asset'
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/:id/status',
  [body('status').notEmpty().withMessage('status is required')],
  streetLightController.updateLightStatus
);

/**
 * @swagger
 * /lights/{id}:
 *   delete:
 *     summary: Delete a street light
 *     tags: [Street Lights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pole ID
 *     responses:
 *       200:
 *         description: Street light deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete('/:id', streetLightController.deleteLight);

module.exports = router;
