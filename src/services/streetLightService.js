const db = require('../database/connection');

class StreetLightService {
  static async getAllLights(zoneId) {
    try {
      let query = 'SELECT * FROM assets';
      const params = [];

      if (zoneId) {
        query += ' WHERE zone_id = $1';
        params.push(zoneId);
      }

      const result = await db.query(query + ' ORDER BY pole_id', params);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch assets: ${error.message}`);
    }
  }

  static async getLightById(poleId) {
    try {
      const result = await db.query(
        'SELECT * FROM assets WHERE pole_id = $1',
        [poleId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to fetch asset: ${error.message}`);
    }
  }

  static async createLight(lightData) {
    try {
      const {
        pole_id,
        zone_id,
        controller_id,
        fixture_type,
        installed_on,
        status,
        gps_lat,
        gps_lng,
      } = lightData;

      const result = await db.query(
        `INSERT INTO assets (pole_id, zone_id, controller_id, fixture_type, installed_on, status, gps_lat, gps_lng)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [pole_id, zone_id, controller_id, fixture_type, installed_on, status, gps_lat, gps_lng]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create asset: ${error.message}`);
    }
  }

  static async updateLightStatus(poleId, status) {
    try {
      const result = await db.query(
        `UPDATE assets SET status = $1
         WHERE pole_id = $2
         RETURNING *`,
        [status, poleId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update asset status: ${error.message}`);
    }
  }

  static async deleteLight(poleId) {
    try {
      await db.query('DELETE FROM assets WHERE pole_id = $1', [poleId]);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete asset: ${error.message}`);
    }
  }
}

module.exports = StreetLightService;
