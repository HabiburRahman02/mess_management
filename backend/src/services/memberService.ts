import pool from '../config/dbConfig';
import { Member } from '../interfaces/memberInterface';
import memberRepository from '../repositories/memberRepository';

class MemberService {
  getMembers = async () => {
    return await memberRepository.getMembers();
  };

  createMember = async (member: Member) => {
    const existing = await pool.query(
      'SELECT * FROM members WHERE email = $1 OR phone = $2 LIMIT 1',
      [member.email, member.phone],
    );

    if (existing.rows.length > 0) {
      throw new Error('Email or phone already exists');
    }
    return await memberRepository.createMember(member);
  };

  deleteMember = async (rid: string) => {
    // check deposits
    const depositCheck = await pool.query('SELECT 1 FROM deposits WHERE member_id = $1 LIMIT 1', [
      rid,
    ]);

    if (depositCheck.rows.length > 0) {
      return { success: false, message: 'Member has deposits, cannot delete' };
    }

    // delete member
    const deletedMember = await memberRepository.deleteMember(rid);

    if (!deletedMember) {
      return { success: false, message: 'Member not found' };
    }

    return { success: true, message: 'Member deleted successfully', data: deletedMember };
  };

  updateMemberByRid = async (updatedMember: Member, rid:string) => {
    return await memberRepository.updateMemberByRid(updatedMember, rid);
  };
}

export default new MemberService();
