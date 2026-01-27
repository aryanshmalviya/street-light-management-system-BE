const db = require('../database/connection');

class MonitoringService {
  static async recordMonitoringData(monitoringData) {
    try {
      const {
        light_id,
        status,
        power_consumption,
        voltage,
        current,
        brightness_level,
        temperature,
      } = monitoringData;

      const result = await db.query(
        `INSERT INTO monitoring_data (light_id, status, power_consumption, voltage, current, brightness_level, temperature)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          light_id,
          status,
          power_consumption,
          voltage,
          current,
          brightness_level,
          temperature,
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to record monitoring data: ${error.message}`);
    }
  }

  static async getLatestMonitoringData(lightId) {
    try {
      const result = await db.query(
        `SELECT * FROM monitoring_data WHERE light_id = $1
         ORDER BY timestamp DESC LIMIT 1`,
        [lightId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to fetch monitoring data: ${error.message}`);
    }
  }

  static async getMonitoringDataRange(lightId, startDate, endDate) {
    try {
      const result = await db.query(
        `SELECT * FROM monitoring_data 
         WHERE light_id = $1 AND timestamp BETWEEN $2 AND $3
         ORDER BY timestamp DESC`,
        [lightId, startDate, endDate]
      );

      return result.rows;
    } catch (error) {
      throw new Error(
        `Failed to fetch monitoring data range: ${error.message}`
      );
    }
  }

  static async getAllLightsStatus(sectionId) {
    try {
      const result = await db.query(
        `SELECT DISTINCT ON (md.light_id) md.*, sl.light_id, sl.section_id
         FROM monitoring_data md
         JOIN street_lights sl ON md.light_id = sl.id
         WHERE sl.section_id = $1
         ORDER BY md.light_id, md.timestamp DESC`,
        [sectionId]
      );

      return result.rows;
    } catch (error) {
      throw new Error(
        `Failed to fetch all lights status: ${error.message}`
      );
    }
  }
}

module.exports = MonitoringService;
