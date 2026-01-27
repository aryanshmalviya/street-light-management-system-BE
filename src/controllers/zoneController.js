const { validationResult } = require('express-validator');
const ZoneService = require('../services/zoneService');
const logger = require('../utils/logger');

exports.getAllZones = async (req, res) => {
  try {
    const zones = await ZoneService.getAllZones();
    res.json({ success: true, data: zones });
  } catch (error) {
    logger.error('Error fetching zones:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getZoneById = async (req, res) => {
  try {
    const { id } = req.params;
    const zone = await ZoneService.getZoneById(id);

    if (!zone) {
      return res.status(404).json({ error: 'Zone not found' });
    }

    res.json({ success: true, data: zone });
  } catch (error) {
    logger.error('Error fetching zone:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createZone = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const zone = await ZoneService.createZone(req.body);
    res.status(201).json({ success: true, data: zone });
  } catch (error) {
    logger.error('Error creating zone:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateZone = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const zone = await ZoneService.updateZone(id, req.body);

    if (!zone) {
      return res.status(404).json({ error: 'Zone not found' });
    }

    res.json({ success: true, data: zone });
  } catch (error) {
    logger.error('Error updating zone:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteZone = async (req, res) => {
  try {
    const { id } = req.params;
    await ZoneService.deleteZone(id);
    res.json({ success: true, message: 'Zone deleted successfully' });
  } catch (error) {
    logger.error('Error deleting zone:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getZoneStats = async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await ZoneService.getZoneStats(id);

    if (!stats) {
      return res.status(404).json({ error: 'Zone not found' });
    }

    res.json({ success: true, data: stats });
  } catch (error) {
    logger.error('Error fetching zone stats:', error);
    res.status(500).json({ error: error.message });
  }
};
