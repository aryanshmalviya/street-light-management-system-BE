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
 *     summary: Get all street lights
 *     tags: [Street Lights]
 *     parameters:
 *       - in: query
 *         name: sectionId
 *         schema:
 *           type: integer
 *         description: Filter by highway section ID
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
 *                     $ref: '#/components/schemas/StreetLight'
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
 *     summary: Get street light by ID
 *     tags: [Street Lights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Street light ID
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
 *                   $ref: '#/components/schemas/StreetLight'
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
 *               - light_id
 *               - section_id
 *             properties:
 *               light_id:
 *                 type: string
 *                 description: Unique light ID code
 *               section_id:
 *                 type: integer
 *                 description: Highway section ID
 *               latitude:
 *                 type: number
 *                 description: GPS latitude
 *               longitude:
 *                 type: number
 *                 description: GPS longitude
 *               wattage:
 *                 type: integer
 *                 description: Power in watts
 *               pole_height:
 *                 type: number
 *                 description: Pole height in meters
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
 *                   $ref: '#/components/schemas/StreetLight'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  [
    body('light_id').notEmpty().withMessage('light_id is required'),
    body('section_id').isInt().withMessage('section_id must be an integer'),
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
 *           type: integer
 *         description: Street light ID
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
 *                   $ref: '#/components/schemas/StreetLight'
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
 *           type: integer
 *         description: Street light ID
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
