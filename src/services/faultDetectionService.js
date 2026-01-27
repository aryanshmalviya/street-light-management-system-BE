const db = require('../database/connection');

class FaultDetectionService {
  static async reportFault(faultData) {
    try {
      const { fault_id, pole_id, zone_id, fault_code, severity, detected_at, status } = faultData;

      const result = await db.query(
        `INSERT INTO faults (fault_id, pole_id, zone_id, fault_code, severity, detected_at, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [fault_id, pole_id, zone_id, fault_code, severity, detected_at || new Date(), status || 'open']
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to report fault: ${error.message}`);
    }
  }

  static async getOpenFaults() {
    try {
      const result = await db.query(
        `SELECT f.*, a.pole_id, z.name as zone_name
         FROM faults f
         JOIN assets a ON f.pole_id = a.pole_id
         JOIN zones z ON f.zone_id = z.zone_id
         WHERE f.status = 'open'
         ORDER BY f.detected_at DESC`
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch open faults: ${error.message}`);
    }
  }

  static async getFaultsByPole(poleId) {
    try {
      const result = await db.query(
        `SELECT * FROM faults WHERE pole_id = $1
         ORDER BY detected_at DESC`,
        [poleId]
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch faults for pole: ${error.message}`);
    }
  }

  static async getFaultById(faultId) {
    try {
      const result = await db.query(
        'SELECT * FROM faults WHERE fault_id = $1',
        [faultId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to fetch fault: ${error.message}`);
    }
  }

  static async resolveFault(faultId, newStatus = 'resolved') {
    try {
      const result = await db.query(
        `UPDATE faults SET status = $1
         WHERE fault_id = $2
         RETURNING *`,
        [newStatus, faultId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to resolve fault: ${error.message}`);
    }
  }

  static async getFaultsByZone(zoneId) {
    try {
      const result = await db.query(
        `SELECT * FROM faults WHERE zone_id = $1 ORDER BY detected_at DESC`,
        [zoneId]
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch faults for zone: ${error.message}`);
    }
  }

  static async getFaultStatistics(zoneId) {
    try {
      const result = await db.query(
        `SELECT 
          COUNT(*) as total_faults,
          COUNT(CASE WHEN status = 'open' THEN 1 END) as open_faults,
          COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_faults,
          COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_faults
         FROM faults
         WHERE zone_id = $1`,
        [zoneId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to fetch fault statistics: ${error.message}`
      );
    }
  }

  static async deleteFault(faultId) {
    try {
      await db.query('DELETE FROM faults WHERE fault_id = $1', [faultId]);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete fault: ${error.message}`);
    }
  }
}

module.exports = FaultDetectionService;
