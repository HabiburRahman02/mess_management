import pool from '../config/dbConfig';

class MealRepository {
  getMealsByMonth = async (month:string) => {
    const result = await pool.query(`
       SELECT
        mb.rid AS member_id,
        mb.name AS member_name,
        mb.email AS member_email,
        m.month AS meal_month,
        SUM(m.meal_count) AS total_meals
    FROM meals m
    JOIN members mb ON m.member_id = mb.rid
    WHERE m.month = $1
    GROUP BY mb.rid, mb.name, mb.email, m.month
    ORDER BY mb.name;
        `,[month]);
    return result.rows;
  };

  getMealDetailsByMemberId = async (memberId: string) => {
    const result = await pool.query(
      `
        SELECT 
            mb.rid AS member_id,
            mb.name,
            mb.email,
            m.month AS meal_month,
            SUM(m.meal_count) AS total_meals,
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'rid', m.rid,
                    'meal_date', TO_CHAR(m.meal_date, 'DD-Mon-YYYY'),
                    'meal_count', m.meal_count,
                    'created_date', TO_CHAR(m.created_at, 'DD-Mon-YYYY'),
                    'created_time', TO_CHAR(m.created_at, 'HH12:MI AM'),
                    'updated_date', TO_CHAR(m.updated_at, 'DD-Mon-YYYY'),
                    'updated_time', TO_CHAR(m.updated_at, 'HH12:MI AM')
                ) ORDER BY m.meal_date DESC
            ) AS meal_details
        FROM meals m
        JOIN members mb ON m.member_id = mb.rid
        WHERE mb.rid = $1
        GROUP BY mb.rid, mb.name, mb.email, m.month;
`,
      [memberId],
    );
    return result.rows[0];
  };

  addMeal = async (memberId: string, mealCount: number) => {
    const result = await pool.query(
      `
      INSERT INTO meals (member_id, meal_date, month, meal_count, created_at, updated_at)
      VALUES ($1, NOW() AT TIME ZONE 'Asia/Dhaka', 
      to_char(NOW() AT TIME ZONE 'Asia/Dhaka', 'YYYY-MM'), 
      $2,
      NOW() AT TIME ZONE 'Asia/Dhaka', 
      NOW() AT TIME ZONE 'Asia/Dhaka')
      RETURNING *
  `,
      [memberId, mealCount],
    );
    return result.rows;
  };

  updateMealByRid = async (rid: string, mealCount: number) => {
    const result = await pool.query(
      `
    UPDATE meals
    SET 
      meal_count = $1, 
      updated_at = NOW() AT TIME ZONE 'Asia/Dhaka'
    WHERE rid = $2
    RETURNING *
      `,
      [mealCount, rid],
    );
    return result.rows[0];
  };
}

export default new MealRepository();
