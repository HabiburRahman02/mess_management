import { NextFunction, Request, Response } from "express";
import { Member } from "../interfaces/memberInterface";
import memberService from "../services/memberService";

class MemberController {
  getMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const member: Member[] = await memberService.getMembers();
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
      const newMember: Member = await memberService.createMember(member);
      res.status(201).json({
        statusText: "SUCCESS",
        data: newMember,
      });
    } catch (err: any) {
      console.log("ERR", err?.message);
      const message = err.message || "Failed to create member";
      // duplicate or validation err
      res.status(400).json({ error: message });
      next(err);
    }
  };
}

export default new MemberController();
