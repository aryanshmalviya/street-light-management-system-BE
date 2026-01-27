const db = require('../database/connection');

class EnergyTrackingService {
  static async recordEnergyUsage(energyData) {
    try {
      const { section_id, light_id, daily_consumption, cost, date } =
        energyData;

      const result = await db.query(
        `INSERT INTO energy_usage (section_id, light_id, daily_consumption, cost, date)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [section_id, light_id, daily_consumption, cost, date]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to record energy usage: ${error.message}`
      );
    }
  }

  static async getDailyEnergyUsage(sectionId, date) {
    try {
      const result = await db.query(
        `SELECT * FROM energy_usage 
         WHERE section_id = $1 AND date = $2`,
        [sectionId, date]
      );

      return result.rows;
    } catch (error) {
      throw new Error(
        `Failed to fetch daily energy usage: ${error.message}`
      );
    }
  }

  static async getMonthlyEnergyUsage(sectionId, month, year) {
    try {
      const result = await db.query(
        `SELECT 
          SUM(daily_consumption) as total_consumption,
          SUM(cost) as total_cost,
          AVG(daily_consumption) as avg_consumption,
          COUNT(*) as days_recorded
         FROM energy_usage
         WHERE section_id = $1 
         AND EXTRACT(MONTH FROM date) = $2 
         AND EXTRACT(YEAR FROM date) = $3`,
        [sectionId, month, year]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to fetch monthly energy usage: ${error.message}`
      );
    }
  }

  static async getEnergyTrends(sectionId, days = 30) {
    try {
      const result = await db.query(
        `SELECT 
          date,
          SUM(daily_consumption) as daily_consumption,
          SUM(cost) as daily_cost
         FROM energy_usage
         WHERE section_id = $1 
         AND date >= CURRENT_DATE - INTERVAL '${days} days'
         GROUP BY date
         ORDER BY date DESC`,
        [sectionId]
      );

      return result.rows;
    } catch (error) {
      throw new Error(
        `Failed to fetch energy trends: ${error.message}`
      );
    }
  }
}

module.exports = EnergyTrackingService;
