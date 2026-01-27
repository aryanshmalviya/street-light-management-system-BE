const db = require('../database/connection');

class AutomationRulesService {
  static async getAllRules() {
    try {
      const result = await db.query('SELECT * FROM automation_rules ORDER BY rule_id');
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch automation rules: ${error.message}`);
    }
  }

  static async getRulesByZone(zoneId) {
    try {
      const result = await db.query(
        'SELECT * FROM automation_rules WHERE zone_id = $1 ORDER BY rule_id',
        [zoneId]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch zone rules: ${error.message}`);
    }
  }

  static async getActiveRulesByZone(zoneId) {
    try {
      const result = await db.query(
        'SELECT * FROM automation_rules WHERE zone_id = $1 AND active = true ORDER BY rule_id',
        [zoneId]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch active zone rules: ${error.message}`);
    }
  }

  static async getRuleById(ruleId) {
    try {
      const result = await db.query(
        'SELECT * FROM automation_rules WHERE rule_id = $1',
        [ruleId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to fetch automation rule: ${error.message}`);
    }
  }

  static async createRule(ruleData) {
    try {
      const {
        rule_id,
        zone_id,
        name,
        condition,
        action,
        active,
      } = ruleData;

      const result = await db.query(
        `INSERT INTO automation_rules (rule_id, zone_id, name, condition, action, active)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [rule_id, zone_id, name, JSON.stringify(condition), action, active !== false]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create automation rule: ${error.message}`);
    }
  }

  static async updateRule(ruleId, ruleData) {
    try {
      const { name, condition, action, active } = ruleData;

      const result = await db.query(
        `UPDATE automation_rules 
         SET name = COALESCE($1, name),
             condition = COALESCE($2, condition),
             action = COALESCE($3, action),
             active = COALESCE($4, active)
         WHERE rule_id = $5
         RETURNING *`,
        [
          name,
          condition ? JSON.stringify(condition) : null,
          action,
          active !== undefined ? active : null,
          ruleId,
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update automation rule: ${error.message}`);
    }
  }

  static async toggleRuleStatus(ruleId, active) {
    try {
      const result = await db.query(
        `UPDATE automation_rules SET active = $1 WHERE rule_id = $2 RETURNING *`,
        [active, ruleId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to toggle rule status: ${error.message}`);
    }
  }

  static async deleteRule(ruleId) {
    try {
      await db.query('DELETE FROM automation_rules WHERE rule_id = $1', [ruleId]);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete automation rule: ${error.message}`);
    }
  }
}

module.exports = AutomationRulesService;
