const db = require('../database/connection');

class MaintenanceService {
  static async scheduleMaintenanceAsync(maintenanceData) {
    try {
      const {
        light_id,
        section_id,
        maintenance_type,
        scheduled_date,
        assigned_to,
        notes,
      } = maintenanceData;

      const result = await db.query(
        `INSERT INTO maintenance_schedule (light_id, section_id, maintenance_type, scheduled_date, assigned_to, notes)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          light_id,
          section_id,
          maintenance_type,
          scheduled_date,
          assigned_to,
          notes,
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to schedule maintenance: ${error.message}`
      );
    }
  }

  static async getPendingMaintenance(sectionId) {
    try {
      const result = await db.query(
        `SELECT m.*, u.name as assigned_to_name, sl.light_id
         FROM maintenance_schedule m
         LEFT JOIN users u ON m.assigned_to = u.id
         LEFT JOIN street_lights sl ON m.light_id = sl.id
         WHERE m.section_id = $1 AND m.status = 'pending'
         ORDER BY m.scheduled_date ASC`,
        [sectionId]
      );

      return result.rows;
    } catch (error) {
      throw new Error(
        `Failed to fetch pending maintenance: ${error.message}`
      );
    }
  }

  static async getMaintenanceHistory(sectionId, limit = 50) {
    try {
      const result = await db.query(
        `SELECT m.*, u.name as assigned_to_name, sl.light_id
         FROM maintenance_schedule m
         LEFT JOIN users u ON m.assigned_to = u.id
         LEFT JOIN street_lights sl ON m.light_id = sl.id
         WHERE m.section_id = $1
         ORDER BY m.completed_date DESC NULLS LAST
         LIMIT $2`,
        [sectionId, limit]
      );

      return result.rows;
    } catch (error) {
      throw new Error(
        `Failed to fetch maintenance history: ${error.message}`
      );
    }
  }

  static async completeMaintenance(maintenanceId) {
    try {
      const result = await db.query(
        `UPDATE maintenance_schedule 
         SET status = 'completed', completed_date = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [maintenanceId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to complete maintenance: ${error.message}`
      );
    }
  }

  static async getMaintenanceStatistics(sectionId) {
    try {
      const result = await db.query(
        `SELECT 
          COUNT(*) as total_schedules,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress
         FROM maintenance_schedule
         WHERE section_id = $1`,
        [sectionId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to fetch maintenance statistics: ${error.message}`
      );
    }
  }
}

module.exports = MaintenanceService;
