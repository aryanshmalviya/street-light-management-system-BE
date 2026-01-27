const db = require('../database/connection');

class ControllerService {
  static async getAllControllers() {
    try {
      const result = await db.query('SELECT * FROM controllers ORDER BY controller_id');
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch controllers: ${error.message}`);
    }
  }

  static async getControllerById(controllerId) {
    try {
      const result = await db.query(
        'SELECT * FROM controllers WHERE controller_id = $1',
        [controllerId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to fetch controller: ${error.message}`);
    }
  }

  static async createController(controllerData) {
    try {
      const {
        controller_id,
        firmware,
        connectivity,
      } = controllerData;

      const result = await db.query(
        `INSERT INTO controllers (controller_id, firmware, connectivity, last_seen)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
         RETURNING *`,
        [controller_id, firmware, connectivity]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create controller: ${error.message}`);
    }
  }

  static async updateController(controllerId, controllerData) {
    try {
      const { firmware, connectivity } = controllerData;

      const result = await db.query(
        `UPDATE controllers SET firmware = COALESCE($1, firmware),
                               connectivity = COALESCE($2, connectivity),
                               last_seen = CURRENT_TIMESTAMP
         WHERE controller_id = $3
         RETURNING *`,
        [firmware, connectivity, controllerId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update controller: ${error.message}`);
    }
  }

  static async updateLastSeen(controllerId) {
    try {
      const result = await db.query(
        `UPDATE controllers SET last_seen = CURRENT_TIMESTAMP
         WHERE controller_id = $1
         RETURNING *`,
        [controllerId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update last_seen: ${error.message}`);
    }
  }

  static async deleteController(controllerId) {
    try {
      await db.query('DELETE FROM controllers WHERE controller_id = $1', [controllerId]);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete controller: ${error.message}`);
    }
  }

  static async getControllerAssets(controllerId) {
    try {
      const result = await db.query(
        'SELECT * FROM assets WHERE controller_id = $1 ORDER BY pole_id',
        [controllerId]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch controller assets: ${error.message}`);
    }
  }
}

module.exports = ControllerService;
