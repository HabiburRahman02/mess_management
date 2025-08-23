import pool from '../config/dbConfig';

class DepositRepository {
  getDeposits = async () => {
    const result = await pool.query(`
    SELECT 
      m.rid,
      m.name,
      m.email,
      SUM(d.amount) AS total_deposit
      FROM 
          deposits d
      JOIN 
          members m ON d.member_id = m.rid
      GROUP BY 
      m.rid, m.name, m.email;
    `);
    return result.rows;
  };

  getDepositByMemberId = async (member_id: string) => {
    const result = await pool.query(
      `  SELECT 
        m.rid AS member_rid,
        m.name,
        m.email,
        SUM(d.amount) AS total_deposit,
        JSON_AGG(
            JSON_BUILD_OBJECT(
            'rid', d.rid,
                'amount', d.amount,
                'created_date', TO_CHAR(d.created_at, 'DD-Mon-YYYY'),
                'created_time', TO_CHAR(d.created_at, 'HH12:MI AM'),
                'updated_date', TO_CHAR(d.updated_at, 'DD-Mon-YYYY'),
                'updated_time', TO_CHAR(d.updated_at, 'HH12:MI AM')
            ) ORDER BY d.created_at
        ) AS deposit_details
    FROM deposits d
    JOIN members m ON d.member_id = m.rid
    WHERE m.rid = $1
    GROUP BY m.rid, m.name, m.email;
    `,
      [member_id],
    );

    return result.rows[0];
  };

  addDeposit = async (deposit: { member_id: string; amount: number }) => {
    const { member_id, amount } = deposit;

    const result = await pool.query(
      `
    INSERT INTO deposits (rid, member_id, amount, month, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      $1,
      $2,
      to_char(NOW() AT TIME ZONE 'Asia/Dhaka', 'YYYY-MM'),
      NOW() AT TIME ZONE 'Asia/Dhaka',
      NOW() AT TIME ZONE 'Asia/Dhaka'
    )
    RETURNING *
    `,
      [member_id, amount],
    );

    return result.rows[0];
  };

  updateDepositByRid = async (rid: string, amount: string) => {
    const result = await pool.query(
      `
    UPDATE deposits
    SET amount = $1, updated_at = NOW() AT TIME ZONE 'Asia/Dhaka'
    WHERE rid = $2
    RETURNING *
    `,
      [amount, rid],
    );
    return result.rows[0];
  };
}

export default new DepositRepository();
