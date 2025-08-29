import pool from '../config/dbConfig';

class mealRateRepository {
  getMealRate = async (month: string) => {
    const result = await pool.query(`
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
        )
        SELECT
            tm.month,
            SUM(tb.total_price) AS total_bazar_cost,
            SUM(tm.total_meals) AS total_meals,
            CASE 
                WHEN SUM(tm.total_meals) > 0 THEN ROUND(SUM(tb.total_price) / SUM(tm.total_meals), 2)
                ELSE 0
            END AS meal_rate
        FROM total_meals tm
        LEFT JOIN total_bazar tb
            ON tm.member_id = tb.member_id
            AND tm.month = tb.month
        WHERE tm.month = $1
        GROUP BY tm.month;
`,[month]);
    return result.rows;
  };
}

export default new mealRateRepository();
