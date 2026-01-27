const db = require('../database/connection');

class MaintenanceService {
  static async createTicket(ticketData) {
    try {
      const {
        ticket_id,
        fault_id,
        assigned_to,
        sla_hours,
        status,
      } = ticketData;

      const result = await db.query(
        `INSERT INTO maintenance_tickets (ticket_id, fault_id, assigned_to, created_at, sla_hours, status)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5)
         RETURNING *`,
        [
          ticket_id,
          fault_id,
          assigned_to,
          sla_hours,
          status || 'open',
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to create maintenance ticket: ${error.message}`
      );
    }
  }

  static async getPendingTickets(limit = 50) {
    try {
      const result = await db.query(
        `SELECT m.*, u.name as assigned_to_name, f.pole_id, f.fault_code
         FROM maintenance_tickets m
         LEFT JOIN users u ON m.assigned_to = u.user_id
         LEFT JOIN faults f ON m.fault_id = f.fault_id
         WHERE m.status IN ('open', 'in_progress')
         ORDER BY m.created_at ASC
         LIMIT $1`,
        [limit]
      );

      return result.rows;
    } catch (error) {
      throw new Error(
        `Failed to fetch pending maintenance tickets: ${error.message}`
      );
    }
  }

  static async getTicketsByUser(assignedTo, limit = 50) {
    try {
      const result = await db.query(
        `SELECT m.*, f.pole_id, f.fault_code, f.severity
         FROM maintenance_tickets m
         LEFT JOIN faults f ON m.fault_id = f.fault_id
         WHERE m.assigned_to = $1
         ORDER BY m.created_at DESC
         LIMIT $2`,
        [assignedTo, limit]
      );

      return result.rows;
    } catch (error) {
      throw new Error(
        `Failed to fetch user tickets: ${error.message}`
      );
    }
  }

  static async getTicketHistory(limit = 50) {
    try {
      const result = await db.query(
        `SELECT m.*, u.name as assigned_to_name, f.pole_id, f.fault_code
         FROM maintenance_tickets m
         LEFT JOIN users u ON m.assigned_to = u.user_id
         LEFT JOIN faults f ON m.fault_id = f.fault_id
         ORDER BY m.created_at DESC
         LIMIT $1`,
        [limit]
      );

      return result.rows;
    } catch (error) {
      throw new Error(
        `Failed to fetch maintenance history: ${error.message}`
      );
    }
  }

  static async updateTicketStatus(ticketId, status) {
    try {
      const result = await db.query(
        `UPDATE maintenance_tickets 
         SET status = $1
         WHERE ticket_id = $2
         RETURNING *`,
        [status, ticketId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to update ticket status: ${error.message}`
      );
    }
  }

  static async getTicketById(ticketId) {
    try {
      const result = await db.query(
        'SELECT * FROM maintenance_tickets WHERE ticket_id = $1',
        [ticketId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to fetch maintenance ticket: ${error.message}`
      );
    }
  }

  static async getMaintenanceStatistics() {
    try {
      const result = await db.query(
        `SELECT 
          COUNT(*) as total_tickets,
          COUNT(CASE WHEN status = 'open' THEN 1 END) as open,
          COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
         FROM maintenance_tickets`
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to fetch maintenance statistics: ${error.message}`
      );
    }
  }

  static async deleteTicket(ticketId) {
    try {
      await db.query('DELETE FROM maintenance_tickets WHERE ticket_id = $1', [ticketId]);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete ticket: ${error.message}`);
    }
  }
}

module.exports = MaintenanceService;
