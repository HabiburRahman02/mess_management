import pool from "../config/dbConfig";
import { Member } from "../interfaces/memberInterface";

class MemberRepository {
  getMembers = async (): Promise<Member[]> => {
    const result = await pool.query("SELECT * FROM members");
    return result.rows;
  };

  createMember = async (member: Member): Promise<Member> => {
    const { name, email, phone } = member;
    const result = await pool.query(
      "INSERT INTO members (name, email, phone) VALUES ($1, $2, $3) RETURNING *",
      [name, email, phone]
    );
    return result.rows[0];
  };
}

export default new MemberRepository();
