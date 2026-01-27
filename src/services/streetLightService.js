const db = require('../database/connection');

class StreetLightService {
  static async getAllLights(sectionId) {
    try {
      let query = 'SELECT * FROM street_lights';
      const params = [];

      if (sectionId) {
        query += ' WHERE section_id = $1';
        params.push(sectionId);
      }

      const result = await db.query(query + ' ORDER BY light_id', params);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch lights: ${error.message}`);
    }
  }

  static async getLightById(lightId) {
    try {
      const result = await db.query(
        'SELECT * FROM street_lights WHERE id = $1',
        [lightId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to fetch light: ${error.message}`);
    }
  }

  static async createLight(lightData) {
    try {
      const {
        light_id,
        section_id,
        latitude,
        longitude,
        wattage,
        pole_height,
      } = lightData;

      const result = await db.query(
        `INSERT INTO street_lights (light_id, section_id, latitude, longitude, wattage, pole_height)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [light_id, section_id, latitude, longitude, wattage, pole_height]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create light: ${error.message}`);
    }
  }

  static async updateLightStatus(lightId, status) {
    try {
      const result = await db.query(
        `UPDATE street_lights SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [status, lightId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update light status: ${error.message}`);
    }
  }

  static async deleteLight(lightId) {
    try {
      await db.query('DELETE FROM street_lights WHERE id = $1', [lightId]);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete light: ${error.message}`);
    }
  }
}

module.exports = StreetLightService;
