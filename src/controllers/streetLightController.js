const { validationResult } = require('express-validator');
const StreetLightService = require('../services/streetLightService');
const logger = require('../utils/logger');

exports.getAllLights = async (req, res) => {
  try {
    const { zoneId } = req.query;
    const lights = await StreetLightService.getAllLights(zoneId);
    res.json({ success: true, data: lights });
  } catch (error) {
    logger.error('Error fetching lights:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getLightById = async (req, res) => {
  try {
    const { id } = req.params;
    const light = await StreetLightService.getLightById(id);

    if (!light) {
      return res.status(404).json({ error: 'Light not found' });
    }

    res.json({ success: true, data: light });
  } catch (error) {
    logger.error('Error fetching light:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createLight = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const light = await StreetLightService.createLight(req.body);
    res.status(201).json({ success: true, data: light });
  } catch (error) {
    logger.error('Error creating light:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateLightStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const light = await StreetLightService.updateLightStatus(id, status);

    if (!light) {
      return res.status(404).json({ error: 'Light not found' });
    }

    res.json({ success: true, data: light });
  } catch (error) {
    logger.error('Error updating light status:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLight = async (req, res) => {
  try {
    const { id } = req.params;
    await StreetLightService.deleteLight(id);
    res.json({ success: true, message: 'Light deleted successfully' });
  } catch (error) {
    logger.error('Error deleting light:', error);
    res.status(500).json({ error: error.message });
  }
};
