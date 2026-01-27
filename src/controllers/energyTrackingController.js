const EnergyTrackingService = require('../services/energyTrackingService');
const logger = require('../utils/logger');

exports.recordEnergyUsage = async (req, res) => {
  try {
    const data = await EnergyTrackingService.recordEnergyUsage(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    logger.error('Error recording energy usage:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getDailyEnergyUsage = async (req, res) => {
  try {
    const { sectionId, date } = req.query;

    if (!sectionId || !date) {
      return res
        .status(400)
        .json({ error: 'sectionId and date are required' });
    }

    const data = await EnergyTrackingService.getDailyEnergyUsage(sectionId, date);
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error fetching daily energy usage:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getMonthlyEnergyUsage = async (req, res) => {
  try {
    const { sectionId, month, year } = req.query;

    if (!sectionId || !month || !year) {
      return res
        .status(400)
        .json({
          error: 'sectionId, month, and year are required',
        });
    }

    const data = await EnergyTrackingService.getMonthlyEnergyUsage(
      sectionId,
      month,
      year
    );
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error fetching monthly energy usage:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getEnergyTrends = async (req, res) => {
  try {
    const { sectionId, days } = req.query;

    if (!sectionId) {
      return res
        .status(400)
        .json({ error: 'sectionId is required' });
    }

    const data = await EnergyTrackingService.getEnergyTrends(
      sectionId,
      days || 30
    );
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error fetching energy trends:', error);
    res.status(500).json({ error: error.message });
  }
};
