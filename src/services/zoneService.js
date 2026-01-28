const db = require('../database/connection');

class ZoneService {
  static async getAllZones() {
    try {
      const result = await db.query('SELECT * FROM zones ORDER BY zone_id');
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch zones: ${error.message}`);
    }
  }

  static async getZoneById(zoneId) {
    try {
      const result = await db.query(
        'SELECT * FROM zones WHERE zone_id = $1',
        [zoneId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to fetch zone: ${error.message}`);
    }
  }

  static async createZone(zoneData) {
    try {
      const {
        zone_id,
        zone_name,
        length_km,
        latitude,
        longitude,
        poles,
      } = zoneData;

      const result = await db.query(
        `INSERT INTO zones (zone_id, name, length_km, latitude, longitude, poles)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [zone_id, zone_name, length_km, latitude, longitude, poles || 0]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create zone: ${error.message}`);
    }
  }

  static async updateZone(zoneId, zoneData) {
    try {
      const { zone_name, length_km, latitude, longitude, poles } = zoneData;

      const result = await db.query(
        `UPDATE zones SET name = COALESCE($1, name), 
                         length_km = COALESCE($2, length_km),
                         latitude = COALESCE($3, latitude),
                         longitude = COALESCE($4, longitude),
                         poles = COALESCE($5, poles)
         WHERE zone_id = $6
         RETURNING *`,
        [zone_name, length_km, latitude, longitude, poles, zoneId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update zone: ${error.message}`);
    }
  }

  static async deleteZone(zoneId) {
    try {
      await db.query('DELETE FROM zones WHERE zone_id = $1', [zoneId]);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete zone: ${error.message}`);
    }
  }

  static async getZoneStats(zoneId) {
    try {
      const result = await db.query(
        `SELECT z.*, COUNT(a.pole_id) as active_poles
         FROM zones z
         LEFT JOIN assets a ON z.zone_id = a.zone_id AND a.status = 'active'
         WHERE z.zone_id = $1
         GROUP BY z.zone_id`,
        [zoneId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to fetch zone stats: ${error.message}`);
    }
  }
}

module.exports = ZoneService;
