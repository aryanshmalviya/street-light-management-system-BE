const db = require('../database/connection');

class TelemetryService {
  static async getTelemetryByPole(poleId, limit = 100) {
    try {
      const result = await db.query(
        `SELECT * FROM telemetry 
         WHERE pole_id = $1 
         ORDER BY ts DESC 
         LIMIT $2`,
        [poleId, limit]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch telemetry: ${error.message}`);
    }
  }

  static async getTelemetryById(telemetryId) {
    try {
      const result = await db.query(
        'SELECT * FROM telemetry WHERE telemetry_id = $1',
        [telemetryId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to fetch telemetry record: ${error.message}`);
    }
  }

  static async recordTelemetry(telemetryData) {
    try {
      const {
        telemetry_id,
        pole_id,
        ts,
        state,
        voltage,
        current_a,
        power_w,
        energy_kwh,
        ambient_lux,
        temperature_c,
        dimming_level,
        fault_code,
      } = telemetryData;

      const result = await db.query(
        `INSERT INTO telemetry 
         (telemetry_id, pole_id, ts, state, voltage, current_a, power_w, energy_kwh, 
          ambient_lux, temperature_c, dimming_level, fault_code)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING *`,
        [
          telemetry_id,
          pole_id,
          ts,
          state,
          voltage,
          current_a,
          power_w,
          energy_kwh,
          ambient_lux,
          temperature_c,
          dimming_level,
          fault_code,
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to record telemetry: ${error.message}`);
    }
  }

  static async getLatestTelemetry(poleId) {
    try {
      const result = await db.query(
        `SELECT * FROM telemetry 
         WHERE pole_id = $1 
         ORDER BY ts DESC 
         LIMIT 1`,
        [poleId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to fetch latest telemetry: ${error.message}`);
    }
  }

  static async getTelemetryRange(poleId, startTime, endTime) {
    try {
      const result = await db.query(
        `SELECT * FROM telemetry 
         WHERE pole_id = $1 AND ts BETWEEN $2 AND $3
         ORDER BY ts DESC`,
        [poleId, startTime, endTime]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch telemetry range: ${error.message}`);
    }
  }

  static async getAveragePowerUsage(poleId, hours = 24) {
    try {
      const result = await db.query(
        `SELECT AVG(power_w) as avg_power, 
                SUM(energy_kwh) as total_energy
         FROM telemetry 
         WHERE pole_id = $1 AND ts > NOW() - INTERVAL '${hours} hours'`,
        [poleId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to calculate average power usage: ${error.message}`);
    }
  }

  static async deleteTelemetry(telemetryId) {
    try {
      await db.query('DELETE FROM telemetry WHERE telemetry_id = $1', [telemetryId]);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete telemetry: ${error.message}`);
    }
  }
}

module.exports = TelemetryService;
