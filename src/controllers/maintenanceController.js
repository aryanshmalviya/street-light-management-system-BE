const MaintenanceService = require('../services/maintenanceService');
const logger = require('../utils/logger');

exports.scheduleMaintenance = async (req, res) => {
  try {
    const { ticket_desc, pole_id, zone_id } = req.body;

    if (!ticket_desc || !pole_id || !zone_id) {
      return res.status(400).json({
        error: 'ticket_desc, pole_id, and zone_id are required'
      });
    }

    const maintenance = await MaintenanceService.createTicket(req.body);
    res.status(201).json({ success: true, data: maintenance });
  } catch (error) {
    logger.error('Error scheduling maintenance:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.assignTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({ error: 'assignedTo is required' });
    }

    const maintenance = await MaintenanceService.assignTicket(ticketId, assignedTo);
    res.json({ success: true, data: maintenance });
  } catch (error) {
    logger.error('Error assigning ticket:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const maintenance = await MaintenanceService.updateTicketStatus(ticketId, status);
    res.json({ success: true, data: maintenance });
  } catch (error) {
    logger.error('Error updating ticket status:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getPendingMaintenance = async (req, res) => {
  try {
    const { zoneId, limit, is_completed, status, start_date, end_date } =
      req.query;

    if (!zoneId) {
      return res.status(400).json({ error: 'zoneId is required' });
    }

    const normalizedZone = String(zoneId).trim().toLowerCase();
    const includeAllZones =
      normalizedZone === 'all' ||
      normalizedZone === 'all zones' ||
      normalizedZone === 'all_zones';

    const isCompleted =
      is_completed === '1' ||
      String(is_completed).toLowerCase() === 'true';

    const maintenance = await MaintenanceService.getPendingTickets(
      includeAllZones ? null : zoneId,
      limit || 50,
      status,
      isCompleted,
      start_date,
      end_date,
      includeAllZones
    );
    res.json({ success: true, data: maintenance });
  } catch (error) {
    logger.error('Error fetching pending maintenance:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getMaintenanceHistory = async (req, res) => {
  try {
    const { zoneId, limit } = req.query;

    if (!zoneId) {
      return res.status(400).json({ error: 'zoneId is required' });
    }

    const history = await MaintenanceService.getMaintenanceHistory(
      zoneId,
      limit || 50
    );
    res.json({ success: true, data: history });
  } catch (error) {
    logger.error('Error fetching maintenance history:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await MaintenanceService.getTicketById(ticketId);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ success: true, data: ticket });
  } catch (error) {
    logger.error('Error fetching ticket:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getMaintenanceStatistics = async (req, res) => {
  try {
    const { zoneId } = req.query;

    if (!zoneId) {
      return res.status(400).json({ error: 'zoneId is required' });
    }

    const stats = await MaintenanceService.getMaintenanceStatistics(zoneId);
    res.json({ success: true, data: stats });
  } catch (error) {
    logger.error('Error fetching maintenance statistics:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const result = await MaintenanceService.deleteTicket(ticketId);
    res.json({ success: true, message: 'Ticket deleted successfully' });
  } catch (error) {
    logger.error('Error deleting ticket:', error);
    res.status(500).json({ error: error.message });
  }
};
