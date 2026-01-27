const MaintenanceService = require('../services/maintenanceService');
const logger = require('../utils/logger');

exports.scheduleMaintenance = async (req, res) => {
  try {
    const maintenance = await MaintenanceService.scheduleMaintenanceAsync(
      req.body
    );
    res.status(201).json({ success: true, data: maintenance });
  } catch (error) {
    logger.error('Error scheduling maintenance:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getPendingMaintenance = async (req, res) => {
  try {
    const { sectionId } = req.query;

    if (!sectionId) {
      return res
        .status(400)
        .json({ error: 'sectionId is required' });
    }

    const maintenance = await MaintenanceService.getPendingMaintenance(
      sectionId
    );
    res.json({ success: true, data: maintenance });
  } catch (error) {
    logger.error('Error fetching pending maintenance:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getMaintenanceHistory = async (req, res) => {
  try {
    const { sectionId, limit } = req.query;

    if (!sectionId) {
      return res
        .status(400)
        .json({ error: 'sectionId is required' });
    }

    const history = await MaintenanceService.getMaintenanceHistory(
      sectionId,
      limit || 50
    );
    res.json({ success: true, data: history });
  } catch (error) {
    logger.error('Error fetching maintenance history:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.completeMaintenance = async (req, res) => {
  try {
    const { maintenanceId } = req.params;
    const maintenance = await MaintenanceService.completeMaintenance(
      maintenanceId
    );
    res.json({ success: true, data: maintenance });
  } catch (error) {
    logger.error('Error completing maintenance:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getMaintenanceStatistics = async (req, res) => {
  try {
    const { sectionId } = req.query;

    if (!sectionId) {
      return res
        .status(400)
        .json({ error: 'sectionId is required' });
    }

    const stats = await MaintenanceService.getMaintenanceStatistics(sectionId);
    res.json({ success: true, data: stats });
  } catch (error) {
    logger.error('Error fetching maintenance statistics:', error);
    res.status(500).json({ error: error.message });
  }
};
