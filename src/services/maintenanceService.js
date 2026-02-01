const { ulid } = require('ulid');
const db = require('../database/connection');

class MaintenanceService {
  static async createTicket(ticketData) {
    try {
      const { ticket_id, ticket_desc, pole_id, zone_id, sla_hours } =
        ticketData;
      const ticketId = ticket_id || ulid();

      const existing = await db.query(
        `SELECT 1 FROM maintenance_tickets WHERE pole_id = $1 AND zone_id = $2 LIMIT 1`,
        [pole_id, zone_id],
      );
      if (existing.rows.length > 0) {
        throw new Error('Maintenance ticket already exists for this pole in this zone');
      }

      const result = await db.query(
        `INSERT INTO maintenance_tickets (ticket_id, ticket_desc, pole_id, zone_id, created_at, sla_hours, status)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6)
         RETURNING *`,
        [
          ticketId,
          ticket_desc,
          pole_id,
          zone_id,
          sla_hours,
          'pending',
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to create maintenance ticket: ${error.message}`
      );
    }
  }

  static async assignTicket(ticketId, assignedTo) {
    try {
      const result = await db.query(
        `UPDATE maintenance_tickets 
         SET assigned_to = $1, status = $2
         WHERE ticket_id = $3
         RETURNING *`,
        [assignedTo, 'assigned', ticketId]
      );

      if (!result.rows[0]) {
        throw new Error('Ticket not found');
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to assign ticket: ${error.message}`
      );
    }
  }

  static async updateTicketStatus(ticketId, status) {
    try {
      const validStatuses = ['pending', 'assigned', 'in_progress', 'completed'];
      
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status. Allowed values: ${validStatuses.join(', ')}`);
      }

      const result = await db.query(
        `UPDATE maintenance_tickets 
         SET status = $1
         WHERE ticket_id = $2
         RETURNING *`,
        [status, ticketId]
      );

      if (!result.rows[0]) {
        throw new Error('Ticket not found');
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to update ticket status: ${error.message}`
      );
    }
  }

  static async getPendingTickets(
    zoneId,
    limit = 50,
    status,
    isCompleted = false,
    startDate,
    endDate,
    includeAllZones = false,
  ) {
    try {
      const normalizedStatus = String(status || '').trim().toLowerCase();
      const conditions = ['1=1'];
      const params = [];

      if (!includeAllZones) {
        params.push(zoneId);
        conditions.push(`m.zone_id = $${params.length}`);
      }

      if (normalizedStatus === 'all') {
        // no status filter
      } else if (
        ['pending', 'assigned', 'in_progress', 'completed'].includes(
          normalizedStatus,
        )
      ) {
        params.push(normalizedStatus);
        conditions.push(`m.status = $${params.length}`);
      } else if (isCompleted) {
        params.push('completed');
        conditions.push(`m.status = $${params.length}`);
      } else {
        conditions.push(
          "m.status IN ('pending', 'assigned', 'in_progress')",
        );
      }

      if (startDate) {
        params.push(startDate);
        conditions.push(`m.created_at >= $${params.length}`);
      }

      if (endDate) {
        params.push(endDate);
        conditions.push(`m.created_at <= $${params.length}`);
      }

      params.push(limit);

      const result = await db.query(
        `SELECT m.*, u.name as assigned_to_name
         FROM maintenance_tickets m
         LEFT JOIN users u ON m.assigned_to = u.user_id
         WHERE ${conditions.join(' AND ')}
         ORDER BY m.created_at ASC
         LIMIT $${params.length}`,
        params
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
        `SELECT m.*, u.name as assigned_to_name
         FROM maintenance_tickets m
         LEFT JOIN users u ON m.assigned_to = u.user_id
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

  static async getMaintenanceHistory(zoneId, limit = 50) {
    try {
      const result = await db.query(
        `SELECT m.*, u.name as assigned_to_name
         FROM maintenance_tickets m
         LEFT JOIN users u ON m.assigned_to = u.user_id
         WHERE m.zone_id = $1
         ORDER BY m.created_at DESC
         LIMIT $2`,
        [zoneId, limit]
      );

      return result.rows;
    } catch (error) {
      throw new Error(
        `Failed to fetch maintenance history: ${error.message}`
      );
    }
  }

  static async getTicketById(ticketId) {
    try {
      const result = await db.query(
        'SELECT m.*, u.name as assigned_to_name FROM maintenance_tickets m LEFT JOIN users u ON m.assigned_to = u.user_id WHERE m.ticket_id = $1',
        [ticketId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to fetch maintenance ticket: ${error.message}`
      );
    }
  }

  static async getMaintenanceStatistics(zoneId) {
    try {
      const result = await db.query(
        `SELECT 
          COUNT(*) as total_tickets,
          COUNT(CASE WHEN m.status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN m.status = 'assigned' THEN 1 END) as assigned,
          COUNT(CASE WHEN m.status = 'in_progress' THEN 1 END) as in_progress,
          COUNT(CASE WHEN m.status = 'completed' THEN 1 END) as completed
         FROM maintenance_tickets m
         WHERE m.zone_id = $1`,
        [zoneId]
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
