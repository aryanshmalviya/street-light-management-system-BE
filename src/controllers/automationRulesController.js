const { validationResult } = require('express-validator');
const AutomationRulesService = require('../services/automationRulesService');
const logger = require('../utils/logger');

exports.getAllRules = async (req, res) => {
  try {
    const rules = await AutomationRulesService.getAllRules();
    res.json({ success: true, data: rules });
  } catch (error) {
    logger.error('Error fetching automation rules:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getRulesByZone = async (req, res) => {
  try {
    const { zoneId } = req.params;
    const rules = await AutomationRulesService.getRulesByZone(zoneId);
    res.json({ success: true, data: rules });
  } catch (error) {
    logger.error('Error fetching zone rules:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getActiveRulesByZone = async (req, res) => {
  try {
    const { zoneId } = req.params;
    const rules = await AutomationRulesService.getActiveRulesByZone(zoneId);
    res.json({ success: true, data: rules });
  } catch (error) {
    logger.error('Error fetching active zone rules:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getRuleById = async (req, res) => {
  try {
    const { id } = req.params;
    const rule = await AutomationRulesService.getRuleById(id);

    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }

    res.json({ success: true, data: rule });
  } catch (error) {
    logger.error('Error fetching rule:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createRule = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const rule = await AutomationRulesService.createRule(req.body);
    res.status(201).json({ success: true, data: rule });
  } catch (error) {
    logger.error('Error creating rule:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateRule = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const rule = await AutomationRulesService.updateRule(id, req.body);

    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }

    res.json({ success: true, data: rule });
  } catch (error) {
    logger.error('Error updating rule:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.toggleRuleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    if (typeof active !== 'boolean') {
      return res.status(400).json({ error: 'active parameter must be a boolean' });
    }

    const rule = await AutomationRulesService.toggleRuleStatus(id, active);

    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }

    res.json({ success: true, data: rule });
  } catch (error) {
    logger.error('Error toggling rule status:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRule = async (req, res) => {
  try {
    const { id } = req.params;
    await AutomationRulesService.deleteRule(id);
    res.json({ success: true, message: 'Rule deleted successfully' });
  } catch (error) {
    logger.error('Error deleting rule:', error);
    res.status(500).json({ error: error.message });
  }
};
