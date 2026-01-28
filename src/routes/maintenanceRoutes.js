const express = require('express');
const maintenanceController = require('../controllers/maintenanceController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// router.use(authMiddleware);

// Schedule a new maintenance ticket
router.post('/schedule', maintenanceController.scheduleMaintenance);

// Assign ticket to a user
router.patch('/:ticketId/assign', maintenanceController.assignTicket);

// Update ticket status
router.patch('/:ticketId/status', maintenanceController.updateTicketStatus);

// Get pending tickets for a zone
router.get('/pending', maintenanceController.getPendingMaintenance);

// Get maintenance history for a zone
router.get('/history', maintenanceController.getMaintenanceHistory);

// Get statistics for a zone
router.get('/stats', maintenanceController.getMaintenanceStatistics);

// Get specific ticket by ID
router.get('/:ticketId', maintenanceController.getTicketById);

// Delete ticket
router.delete('/:ticketId', maintenanceController.deleteTicket);

module.exports = router;
