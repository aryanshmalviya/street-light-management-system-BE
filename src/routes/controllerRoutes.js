const express = require('express');
const { body } = require('express-validator');
const controllerController = require('../controllers/controllerController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /controllers:
 *   get:
 *     summary: Get all controllers
 *     tags: [Controllers]
 *     responses:
 *       200:
 *         description: List of all controllers
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
 *                     $ref: '#/components/schemas/Controller'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', controllerController.getAllControllers);

/**
 * @swagger
 * /controllers/{id}:
 *   get:
 *     summary: Get controller by ID
 *     tags: [Controllers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Controller ID
 *     responses:
 *       200:
 *         description: Controller details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Controller'
 *       404:
 *         description: Controller not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', controllerController.getControllerById);

/**
 * @swagger
 * /controllers:
 *   post:
 *     summary: Create a new controller
 *     tags: [Controllers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - controller_id
 *             properties:
 *               controller_id:
 *                 type: string
 *               firmware:
 *                 type: string
 *               connectivity:
 *                 type: string
 *     responses:
 *       201:
 *         description: Controller created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', [
  body('controller_id').isString().notEmpty(),
], controllerController.createController);

/**
 * @swagger
 * /controllers/{id}:
 *   put:
 *     summary: Update controller
 *     tags: [Controllers]
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
 *               firmware:
 *                 type: string
 *               connectivity:
 *                 type: string
 *     responses:
 *       200:
 *         description: Controller updated successfully
 *       404:
 *         description: Controller not found
 */
router.put('/:id', controllerController.updateController);

/**
 * @swagger
 * /controllers/{id}:
 *   delete:
 *     summary: Delete controller
 *     tags: [Controllers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Controller deleted successfully
 *       404:
 *         description: Controller not found
 */
router.delete('/:id', controllerController.deleteController);

/**
 * @swagger
 * /controllers/{id}/assets:
 *   get:
 *     summary: Get assets managed by controller
 *     tags: [Controllers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of assets
 *       404:
 *         description: Controller not found
 */
router.get('/:id/assets', controllerController.getControllerAssets);

/**
 * @swagger
 * /controllers/{id}/heartbeat:
 *   post:
 *     summary: Update controller last seen timestamp
 *     tags: [Controllers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Last seen updated successfully
 *       404:
 *         description: Controller not found
 */
router.post('/:id/heartbeat', controllerController.updateLastSeen);

module.exports = router;
