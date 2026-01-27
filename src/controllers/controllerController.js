const { validationResult } = require('express-validator');
const ControllerService = require('../services/controllerService');
const logger = require('../utils/logger');

exports.getAllControllers = async (req, res) => {
  try {
    const controllers = await ControllerService.getAllControllers();
    res.json({ success: true, data: controllers });
  } catch (error) {
    logger.error('Error fetching controllers:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getControllerById = async (req, res) => {
  try {
    const { id } = req.params;
    const controller = await ControllerService.getControllerById(id);

    if (!controller) {
      return res.status(404).json({ error: 'Controller not found' });
    }

    res.json({ success: true, data: controller });
  } catch (error) {
    logger.error('Error fetching controller:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const controller = await ControllerService.createController(req.body);
    res.status(201).json({ success: true, data: controller });
  } catch (error) {
    logger.error('Error creating controller:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const controller = await ControllerService.updateController(id, req.body);

    if (!controller) {
      return res.status(404).json({ error: 'Controller not found' });
    }

    res.json({ success: true, data: controller });
  } catch (error) {
    logger.error('Error updating controller:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteController = async (req, res) => {
  try {
    const { id } = req.params;
    await ControllerService.deleteController(id);
    res.json({ success: true, message: 'Controller deleted successfully' });
  } catch (error) {
    logger.error('Error deleting controller:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getControllerAssets = async (req, res) => {
  try {
    const { id } = req.params;
    const assets = await ControllerService.getControllerAssets(id);
    res.json({ success: true, data: assets });
  } catch (error) {
    logger.error('Error fetching controller assets:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateLastSeen = async (req, res) => {
  try {
    const { id } = req.params;
    const controller = await ControllerService.updateLastSeen(id);

    if (!controller) {
      return res.status(404).json({ error: 'Controller not found' });
    }

    res.json({ success: true, data: controller });
  } catch (error) {
    logger.error('Error updating controller last_seen:', error);
    res.status(500).json({ error: error.message });
  }
};
