import { NextFunction, Request, Response } from "express";
import MemberRepository from "../repositories/memberRepository";
import { Member } from "../interfaces/memberInterface";

class MemberController {
  private memberRepo: MemberRepository;

  constructor() {
    this.memberRepo = new MemberRepository();
  }

  getMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const member: Member[] = await this.memberRepo.getMembers();
      res.status(200).json({
        statusText: "SUCCESS",
        data: member,
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch members" });
      next(err);
    }
  };
  createMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const member: Member = req.body;
      const newMember: Member = await this.memberRepo.createMember(member);
      res.status(201).json({
        statusText: "SUCCESS",
        data: newMember,
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to create member" });
      next(err);
    }
  };
}

export default MemberController;
