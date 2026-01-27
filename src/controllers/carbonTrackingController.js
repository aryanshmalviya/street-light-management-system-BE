const CarbonTrackingService = require('../services/carbonTrackingService');
const logger = require('../utils/logger');

exports.recordCarbonFootprint = async (req, res) => {
  try {
    const data = await CarbonTrackingService.recordCarbonFootprint(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    logger.error('Error recording carbon footprint:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getCarbonReport = async (req, res) => {
  try {
    const { sectionId, startDate, endDate } = req.query;

    if (!sectionId || !startDate || !endDate) {
      return res.status(400).json({
        error: 'sectionId, startDate, and endDate are required',
      });
    }

    const report = await CarbonTrackingService.getCarbonReport(
      sectionId,
      startDate,
      endDate
    );
    res.json({ success: true, data: report });
  } catch (error) {
    logger.error('Error fetching carbon report:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getDailyCarbonData = async (req, res) => {
  try {
    const { sectionId, date } = req.query;

    if (!sectionId || !date) {
      return res
        .status(400)
        .json({ error: 'sectionId and date are required' });
    }

    const data = await CarbonTrackingService.getDailyCarbonData(sectionId, date);

    if (!data) {
      return res.status(404).json({ error: 'No carbon data found for this date' });
    }

    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error fetching daily carbon data:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getMonthlyCarbonTrends = async (req, res) => {
  try {
    const { sectionId, months } = req.query;

    if (!sectionId) {
      return res
        .status(400)
        .json({ error: 'sectionId is required' });
    }

    const trends = await CarbonTrackingService.getMonthlyCarbonTrends(
      sectionId,
      months || 12
    );
    res.json({ success: true, data: trends });
  } catch (error) {
    logger.error('Error fetching monthly carbon trends:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getEnvironmentalImpact = async (req, res) => {
  try {
    const { sectionId } = req.query;

    if (!sectionId) {
      return res
        .status(400)
        .json({ error: 'sectionId is required' });
    }

    const impact = await CarbonTrackingService.getEnvironmentalImpact(sectionId);
    res.json({ success: true, data: impact });
  } catch (error) {
    logger.error('Error fetching environmental impact:', error);
    res.status(500).json({ error: error.message });
  }
};
