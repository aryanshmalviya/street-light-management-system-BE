const { validationResult } = require('express-validator');
const TelemetryService = require('../services/telemetryService');
const logger = require('../utils/logger');

exports.getTelemetryByPole = async (req, res) => {
  try {
    const { poleId } = req.params;
    const { limit } = req.query;
    const telemetry = await TelemetryService.getTelemetryByPole(poleId, limit || 100);
    res.json({ success: true, data: telemetry });
  } catch (error) {
    logger.error('Error fetching telemetry:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getTelemetryById = async (req, res) => {
  try {
    const { id } = req.params;
    const telemetry = await TelemetryService.getTelemetryById(id);

    if (!telemetry) {
      return res.status(404).json({ error: 'Telemetry record not found' });
    }

    res.json({ success: true, data: telemetry });
  } catch (error) {
    logger.error('Error fetching telemetry record:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.recordTelemetry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const telemetry = await TelemetryService.recordTelemetry(req.body);
    res.status(201).json({ success: true, data: telemetry });
  } catch (error) {
    logger.error('Error recording telemetry:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getLatestTelemetry = async (req, res) => {
  try {
    const { poleId } = req.params;
    const telemetry = await TelemetryService.getLatestTelemetry(poleId);

    if (!telemetry) {
      return res.status(404).json({ error: 'No telemetry data found for pole' });
    }

    res.json({ success: true, data: telemetry });
  } catch (error) {
    logger.error('Error fetching latest telemetry:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getTelemetryRange = async (req, res) => {
  try {
    const { poleId } = req.params;
    const { startTime, endTime } = req.query;

    if (!startTime || !endTime) {
      return res.status(400).json({ error: 'startTime and endTime are required' });
    }

    const telemetry = await TelemetryService.getTelemetryRange(poleId, startTime, endTime);
    res.json({ success: true, data: telemetry });
  } catch (error) {
    logger.error('Error fetching telemetry range:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAveragePowerUsage = async (req, res) => {
  try {
    const { poleId } = req.params;
    const { hours } = req.query;

    const stats = await TelemetryService.getAveragePowerUsage(poleId, hours || 24);
    res.json({ success: true, data: stats });
  } catch (error) {
    logger.error('Error calculating average power usage:', error);
    res.status(500).json({ error: error.message });
  }
};
