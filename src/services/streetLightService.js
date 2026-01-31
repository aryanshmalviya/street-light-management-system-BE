const { ulid } = require('ulid');
const db = require('../database/connection');
const mqttClient = require('../mqtt/mqttcontroller');
const logger = require('../utils/logger');
const publish_topic = process.env.MQTTPUBLISHTOPIC || 'control/poles';

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
        zone_id,
        controller_id,
        fixture_type,
        installed_on,
        status,
        gps_lat,
        gps_lng,
      } = lightData;
      const pole_id = ulid ();
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

  // New method: Control single pole with MQTT
  static async controlPole(poleId, command) {
    try {
      const validCommands = ['ON', 'OFF'];
      if (!validCommands.includes(command.toUpperCase())) {
        throw new Error(`Invalid command. Allowed values: ${validCommands.join(', ')}`);
      }

      // Get the pole to verify it exists
      const light = await this.getLightById(poleId);
      if (!light) {
        throw new Error('Pole not found');
      }

      // Create MQTT payload
      const payload = {
        pole_id: poleId,
        command: command.toUpperCase(),
        timestamp: new Date().toISOString()
      };

      // Publish to MQTT broker
      return new Promise((resolve, reject) => {
        mqttClient.publish(publish_topic, JSON.stringify(payload), { qos: 1 }, (err) => {
          if (err) {
            logger.error(`MQTT publish error for pole ${poleId}:`, err);
            reject(new Error(`Failed to publish command to MQTT broker: ${err.message}`));
          } else {
            logger.info(`Command ${command} published for pole ${poleId}`);
            resolve({
              success: true,
              pole_id: poleId,
              command: command.toUpperCase(),
              message: `Command sent successfully to pole ${poleId}`,
              timestamp: new Date().toISOString()
            });
          }
        });
      });
    } catch (error) {
      throw new Error(`Failed to control pole: ${error.message}`);
    }
  }

  // New method: Control all poles in a zone with MQTT
  static async controlZone(zoneId, command) {
    try {
      const validCommands = ['ON', 'OFF'];
      if (!validCommands.includes(command.toUpperCase())) {
        throw new Error(`Invalid command. Allowed values: ${validCommands.join(', ')}`);
      }

      // Get all poles in the zone
      const result = await db.query(
        'SELECT pole_id FROM assets WHERE zone_id = $1',
        [zoneId]
      );

      if (result.rows.length === 0) {
        throw new Error(`No poles found in zone ${zoneId}`);
      }

      const poles = result.rows.map(row => row.pole_id);
      const failedPoles = [];
      const successfulPoles = [];

      // Publish command for each pole
      for (const poleId of poles) {
        const payload = {
          pole_id: poleId,
          command: command.toUpperCase(),
          timestamp: new Date().toISOString()
        };

        await new Promise((resolve) => {
          mqttClient.publish(publish_topic, JSON.stringify(payload), { qos: 1 }, (err) => {
            if (err) {
              logger.error(`MQTT publish error for pole ${poleId}:`, err);
              failedPoles.push(poleId);
            } else {
              successfulPoles.push(poleId);
              logger.info(`Command ${command} published for pole ${poleId}`);
            }
            resolve();
          });
        });
      }

      return {
        success: true,
        zone_id: zoneId,
        command: command.toUpperCase(),
        total_poles: poles.length,
        successful_poles: successfulPoles,
        failed_poles: failedPoles,
        message: `Command sent to ${successfulPoles.length}/${poles.length} poles in zone ${zoneId}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to control zone: ${error.message}`);
    }
  }
}

module.exports = StreetLightService;
