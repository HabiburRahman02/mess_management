import pool from '../config/dbConfig';

class mealRateRepository {
  getMealRate = async (month: string) => {
    const result = await pool.query(
      `
           WITH total_bazar AS (
    SELECT 
        bc.member_id,
        bc.month,
        SUM(bci.price) AS total_price
    FROM bazar_costs bc
    JOIN bazar_cost_items bci ON bci.bazar_id = bc.rid
    GROUP BY bc.member_id, bc.month
),
total_meals AS (
    SELECT 
        member_id,
        month,
        SUM(meal_count) AS total_meals
    FROM meals
    GROUP BY member_id, month
),
total_deposits AS (
    SELECT
        member_id,
        month,
        SUM(amount) AS total_deposit
    FROM deposits
    GROUP BY member_id, month
)
SELECT
    tm.month,
    COALESCE(SUM(tb.total_price), 0) AS total_bazar_cost,
    SUM(tm.total_meals) AS total_meals,
    COALESCE(SUM(td.total_deposit), 0) AS total_deposit,
    CASE 
        WHEN SUM(tm.total_meals) > 0 THEN ROUND(COALESCE(SUM(tb.total_price),0) / SUM(tm.total_meals), 2)
        ELSE 0
    END AS meal_rate
FROM total_meals tm
LEFT JOIN total_bazar tb
    ON tm.member_id = tb.member_id
    AND tm.month = tb.month
LEFT JOIN total_deposits td
    ON tm.member_id = td.member_id
    AND tm.month = td.month
WHERE tm.month = $1
GROUP BY tm.month;

`,
      [month],
    );
    return result.rows;
  };

  getPerMemberMealStatsByMonth = async (month: string) => {
    // Global meal rate
    const mealRateResult = await this.getMealRate(month);
    const mealRate = mealRateResult[0]?.meal_rate || 0;

    // প্রতি member এর meals ও deposits
    const result = await pool.query(
      `
      WITH total_meals AS (
  SELECT member_id, SUM(meal_count) AS total_meals
  FROM meals
  WHERE month = $1
  GROUP BY member_id
),
total_deposits AS (
  SELECT member_id, SUM(amount) AS total_deposit
  FROM deposits
  WHERE month = $1
  GROUP BY member_id
)
SELECT
  mb.rid AS member_id,
  mb.name AS member_name,
  mb.email AS member_email,
  COALESCE(tm.total_meals, 0) AS total_meals,
  COALESCE(td.total_deposit, 0) AS total_deposit
FROM members mb
LEFT JOIN total_meals tm ON mb.rid = tm.member_id
LEFT JOIN total_deposits td ON mb.rid = td.member_id
ORDER BY mb.name;
      `,
      [month],
    );

    // Balance = total_deposit - (total_meals * meal_rate)
    const memberStats = result.rows.map((row) => ({
      ...row,
      meal_rate: mealRate,
      balance: parseFloat(
        (parseFloat(row.total_deposit) - parseFloat(row.total_meals) * mealRate).toFixed(2),
      ),
    }));

    return memberStats;
  };
}

export default new mealRateRepository();
