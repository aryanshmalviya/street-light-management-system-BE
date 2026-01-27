const db = require('../database/connection');

class CarbonTrackingService {
  static async recordCarbonFootprint(carbonData) {
    try {
      const {
        section_id,
        date,
        energy_consumed_kwh,
        co2_emissions_kg,
        carbon_credits,
        baseline_consumption,
        reduction_percentage,
      } = carbonData;

      const result = await db.query(
        `INSERT INTO carbon_tracking (section_id, date, energy_consumed_kwh, co2_emissions_kg, carbon_credits, baseline_consumption, reduction_percentage)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          section_id,
          date,
          energy_consumed_kwh,
          co2_emissions_kg,
          carbon_credits,
          baseline_consumption,
          reduction_percentage,
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to record carbon footprint: ${error.message}`
      );
    }
  }

  static async getCarbonReport(sectionId, startDate, endDate) {
    try {
      const result = await db.query(
        `SELECT 
          SUM(energy_consumed_kwh) as total_energy_kwh,
          SUM(co2_emissions_kg) as total_co2_kg,
          SUM(carbon_credits) as total_carbon_credits,
          AVG(reduction_percentage) as avg_reduction_percentage
         FROM carbon_tracking
         WHERE section_id = $1 AND date BETWEEN $2 AND $3`,
        [sectionId, startDate, endDate]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to fetch carbon report: ${error.message}`
      );
    }
  }

  static async getDailyCarbonData(sectionId, date) {
    try {
      const result = await db.query(
        `SELECT * FROM carbon_tracking 
         WHERE section_id = $1 AND date = $2`,
        [sectionId, date]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to fetch daily carbon data: ${error.message}`
      );
    }
  }

  static async getMonthlyCarbonTrends(sectionId, months = 12) {
    try {
      const result = await db.query(
        `SELECT 
          DATE_TRUNC('month', date) as month,
          SUM(energy_consumed_kwh) as total_energy_kwh,
          SUM(co2_emissions_kg) as total_co2_kg,
          SUM(carbon_credits) as total_carbon_credits
         FROM carbon_tracking
         WHERE section_id = $1 
         AND date >= CURRENT_DATE - INTERVAL '${months} months'
         GROUP BY DATE_TRUNC('month', date)
         ORDER BY month DESC`,
        [sectionId]
      );

      return result.rows;
    } catch (error) {
      throw new Error(
        `Failed to fetch monthly carbon trends: ${error.message}`
      );
    }
  }

  static async getEnvironmentalImpact(sectionId) {
    try {
      const result = await db.query(
        `SELECT 
          SUM(energy_consumed_kwh) as total_energy_saved_kwh,
          SUM(co2_emissions_kg) as total_co2_avoided_kg,
          SUM(carbon_credits) as total_carbon_credits_earned,
          COUNT(DISTINCT date) as days_tracked
         FROM carbon_tracking
         WHERE section_id = $1`,
        [sectionId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to fetch environmental impact: ${error.message}`
      );
    }
  }
}

module.exports = CarbonTrackingService;
