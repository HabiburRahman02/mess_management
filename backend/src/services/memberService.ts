import pool from "../config/dbConfig";
import { Member } from "../interfaces/memberInterface";
import memberRepository from "../repositories/memberRepository";

class MemberService {
  getMembers = async () => {
    return await memberRepository.getMembers();
  };
  createMember = async (member: Member) => {
    const existing = await pool.query(
      "SELECT * FROM members WHERE email = $1 OR phone = $2 LIMIT 1",
      [member.email, member.phone]
    );

    if (existing.rows.length > 0) {
      throw new Error("Email or phone already exists");
    }

    return await memberRepository.createMember(member);
  };
}

export default new MemberService();
