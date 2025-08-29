import pool from '../config/dbConfig';
import { Member } from '../interfaces/memberInterface';

class MemberRepository {
  getMembers = async (): Promise<Member[]> => {
    const result = await pool.query('SELECT * FROM members');
    return result.rows;
  };

  createMember = async (member: Member): Promise<Member> => {
    const { name, email, address, phone } = member;
    const result = await pool.query(
      'INSERT INTO members (name, email, address, phone) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, address, phone],
    );
    return result.rows[0];
  };

  deleteMember = async (rid: string) => {
    const result = await pool.query(
      `DELETE FROM members
       WHERE rid = $1
       RETURNING *`,
      [rid],
    );
    return result.rows[0];
  };
  updateMemberByRid = async (updatedMember: Member, rid: string) => {
    const { name, email, address, phone, status } = updatedMember;
    const result = await pool.query(
      `
    UPDATE members
    SET 
      name = $1,
      email = $2,
      address = $3,
      phone = $4,
      status = $5,
      updated_at = NOW()
    WHERE rid = $6
    RETURNING *;
    `,
      [name, email, address, phone, status, rid],
    );
    return result.rows[0];
  };
}

export default new MemberRepository();
