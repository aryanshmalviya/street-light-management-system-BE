const express = require('express');
const { body } = require('express-validator');
const automationRulesController = require('../controllers/automationRulesController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /automation-rules:
 *   get:
 *     summary: Get all automation rules
 *     tags: [Automation Rules]
 *     responses:
 *       200:
 *         description: List of all automation rules
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
 *                     $ref: '#/components/schemas/AutomationRule'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', automationRulesController.getAllRules);

/**
 * @swagger
 * /automation-rules/zone/{zoneId}:
 *   get:
 *     summary: Get rules for a zone
 *     tags: [Automation Rules]
 *     parameters:
 *       - in: path
 *         name: zoneId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of zone rules
 */
router.get('/zone/:zoneId', automationRulesController.getRulesByZone);

/**
 * @swagger
 * /automation-rules/zone/{zoneId}/active:
 *   get:
 *     summary: Get active rules for a zone
 *     tags: [Automation Rules]
 *     parameters:
 *       - in: path
 *         name: zoneId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of active zone rules
 */
router.get('/zone/:zoneId/active', automationRulesController.getActiveRulesByZone);

/**
 * @swagger
 * /automation-rules/{id}:
 *   get:
 *     summary: Get rule by ID
 *     tags: [Automation Rules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rule details
 *       404:
 *         description: Rule not found
 */
router.get('/:id', automationRulesController.getRuleById);

/**
 * @swagger
 * /automation-rules:
 *   post:
 *     summary: Create a new automation rule
 *     tags: [Automation Rules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rule_id
 *               - zone_id
 *               - name
 *               - condition
 *               - action
 *             properties:
 *               rule_id:
 *                 type: string
 *               zone_id:
 *                 type: string
 *               name:
 *                 type: string
 *               condition:
 *                 type: object
 *               action:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Rule created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', [
  body('rule_id').isString().notEmpty(),
  body('zone_id').isString().notEmpty(),
  body('name').isString().notEmpty(),
  body('condition').isObject(),
  body('action').isString().notEmpty(),
], automationRulesController.createRule);

/**
 * @swagger
 * /automation-rules/{id}:
 *   put:
 *     summary: Update automation rule
 *     tags: [Automation Rules]
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
 *               condition:
 *                 type: object
 *               action:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Rule updated successfully
 *       404:
 *         description: Rule not found
 */
router.put('/:id', automationRulesController.updateRule);

/**
 * @swagger
 * /automation-rules/{id}/toggle:
 *   post:
 *     summary: Toggle rule active status
 *     tags: [Automation Rules]
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
 *             required:
 *               - active
 *             properties:
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Rule status toggled successfully
 *       404:
 *         description: Rule not found
 */
router.post('/:id/toggle', automationRulesController.toggleRuleStatus);

/**
 * @swagger
 * /automation-rules/{id}:
 *   delete:
 *     summary: Delete automation rule
 *     tags: [Automation Rules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rule deleted successfully
 *       404:
 *         description: Rule not found
 */
router.delete('/:id', automationRulesController.deleteRule);

module.exports = router;
