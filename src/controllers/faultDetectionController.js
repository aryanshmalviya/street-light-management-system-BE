const FaultDetectionService = require('../services/faultDetectionService');
const logger = require('../utils/logger');

exports.reportFault = async (req, res) => {
  try {
    const fault = await FaultDetectionService.reportFault(req.body);
    res.status(201).json({ success: true, data: fault });
  } catch (error) {
    logger.error('Error reporting fault:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getOpenFaults = async (req, res) => {
  try {
    const faults = await FaultDetectionService.getOpenFaults();
    res.json({ success: true, data: faults });
  } catch (error) {
    logger.error('Error fetching open faults:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getFaultsByLight = async (req, res) => {
  try {
    const { lightId } = req.params;
    const faults = await FaultDetectionService.getFaultsByLight(lightId);
    res.json({ success: true, data: faults });
  } catch (error) {
    logger.error('Error fetching faults:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.resolveFault = async (req, res) => {
  try {
    const { faultId } = req.params;
    const fault = await FaultDetectionService.resolveFault(faultId);
    res.json({ success: true, data: fault });
  } catch (error) {
    logger.error('Error resolving fault:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getFaultStatistics = async (req, res) => {
  try {
    const { sectionId } = req.query;

    if (!sectionId) {
      return res
        .status(400)
        .json({ error: 'sectionId is required' });
    }

    const stats = await FaultDetectionService.getFaultStatistics(sectionId);
    res.json({ success: true, data: stats });
  } catch (error) {
    logger.error('Error fetching fault statistics:', error);
    res.status(500).json({ error: error.message });
  }
};
