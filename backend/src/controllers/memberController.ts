import { NextFunction, Request, Response } from 'express';
import { Member } from '../interfaces/memberInterface';
import memberService from '../services/memberService';

class MemberController {
  getMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const member: Member[] = await memberService.getMembers();
      res.status(200).json({
        statusText: 'SUCCESS',
        message: 'Member get successfully',
        data: member,
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch members' });
      next(err);
    }
  };

  createMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const member: Member = req.body;
    try {
      const newMember: Member = await memberService.createMember(member);
      res.status(201).json({
        statusText: 'SUCCESS',
        message: 'Member create successfully',
        data: newMember,
      });
    } catch (err: any) {
      console.log('ERR', err?.message);
      const message = err.message || 'Failed to create member';
      // duplicate or validation err
      res.status(400).json({ error: message });
      next(err);
    }
  };

  deleteMember = async (req: Request, res: Response) => {
    const { rid } = req.params;
    try {
      const result = await memberService.deleteMember(rid);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Error deleting member:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
}

export default new MemberController();
