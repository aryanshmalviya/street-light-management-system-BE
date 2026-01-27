const MonitoringService = require('../services/monitoringService');
const logger = require('../utils/logger');

exports.recordMonitoringData = async (req, res) => {
  try {
    const data = await MonitoringService.recordMonitoringData(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    logger.error('Error recording monitoring data:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getLatestMonitoringData = async (req, res) => {
  try {
    const { lightId } = req.params;
    const data = await MonitoringService.getLatestMonitoringData(lightId);

    if (!data) {
      return res.status(404).json({ error: 'No monitoring data found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error fetching latest monitoring data:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getMonitoringDataRange = async (req, res) => {
  try {
    const { lightId } = req.params;
    const { startDate, endDate } = req.query;

    const data = await MonitoringService.getMonitoringDataRange(
      lightId,
      startDate,
      endDate
    );

    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error fetching monitoring data range:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllLightsStatus = async (req, res) => {
  try {
    const { sectionId } = req.query;

    if (!sectionId) {
      return res
        .status(400)
        .json({ error: 'sectionId is required' });
    }

    const data = await MonitoringService.getAllLightsStatus(sectionId);
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error fetching all lights status:', error);
    res.status(500).json({ error: error.message });
  }
};
