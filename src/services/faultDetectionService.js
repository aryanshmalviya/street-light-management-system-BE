const db = require('../database/connection');

class FaultDetectionService {
  static async reportFault(faultData) {
    try {
      const { light_id, fault_type, severity, description } = faultData;

      const result = await db.query(
        `INSERT INTO fault_detection (light_id, fault_type, severity, description)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [light_id, fault_type, severity, description]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to report fault: ${error.message}`);
    }
  }

  static async getOpenFaults() {
    try {
      const result = await db.query(
        `SELECT fd.*, sl.light_id, hs.name as section_name
         FROM fault_detection fd
         JOIN street_lights sl ON fd.light_id = sl.id
         JOIN highway_sections hs ON sl.section_id = hs.id
         WHERE fd.status = 'open'
         ORDER BY fd.detected_at DESC`
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch open faults: ${error.message}`);
    }
  }

  static async getFaultsByLight(lightId) {
    try {
      const result = await db.query(
        `SELECT * FROM fault_detection WHERE light_id = $1
         ORDER BY detected_at DESC`,
        [lightId]
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch faults for light: ${error.message}`);
    }
  }

  static async resolveFault(faultId) {
    try {
      const result = await db.query(
        `UPDATE fault_detection SET status = 'resolved', resolved_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [faultId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to resolve fault: ${error.message}`);
    }
  }

  static async getFaultStatistics(sectionId) {
    try {
      const result = await db.query(
        `SELECT 
          COUNT(*) as total_faults,
          COUNT(CASE WHEN status = 'open' THEN 1 END) as open_faults,
          COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_faults,
          COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_faults
         FROM fault_detection fd
         JOIN street_lights sl ON fd.light_id = sl.id
         WHERE sl.section_id = $1`,
        [sectionId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to fetch fault statistics: ${error.message}`
      );
    }
  }
}

module.exports = FaultDetectionService;
