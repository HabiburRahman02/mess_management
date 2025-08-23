import { NextFunction, Request, Response } from 'express';
import depositService from '../services/depositService';

class DepositController {
  getDeposits = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await depositService.getDeposits();
      res.status(200).json({
        statusText: 'SUCCESS',
        message: 'All deposits fetched successfully',
        data: result,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch deposits' });
      next(error);
    }
  };

  getDepositByMemberId = async (req: Request, res: Response, next: NextFunction) => {
    const memberId = req.params.memberId as string;
    try {
      const result = await depositService.getDepositByMemberId(memberId);
      res.status(200).json({
        statusText: 'SUCCESS',
        message: 'Specific deposit fetched successfully',
        data: result,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch deposit by member id' });
      next(error);
    }
  };

  addDeposit = async (req: Request, res: Response, next: NextFunction) => {
    const { member_id, amount } = req.body;
    try {
      const result = await depositService.addDeposit({ member_id, amount });
      res.status(201).json({
        statusText: 'SUCCESS',
        message: 'Deposit added successfully',
        data: result,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add deposit' });
      next(error);
    }
  };

  updateDepositByRid = async (req: Request, res: Response, next: NextFunction) => {
    const rid = req.params.rid;
    const { amount } = req.body;
    console.log('uuuuuuuuuuuu',rid, amount);

    try {
      const result = await depositService.updateDepositByRid(rid, amount);
      res.status(200).json({
        statusText: 'SUCCESS',
        message: 'Deposit updated successfully',
        data: result,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update deposit' });
      next(error);
    }
  };
}

export default new DepositController();
