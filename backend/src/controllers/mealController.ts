import { NextFunction, Request, Response } from 'express';
import mealService from '../services/mealService';
import { logger } from '../utilities/logger';

class MealController {
  getMealsByMonth = async (req: Request, res: Response, next: NextFunction) => {
    const month = req.query.month as string;
    try {
      const result = await mealService.getMealsByMonth(month);
      res.status(200).json({
        statusText: 'SUCCESS',
        message: 'Get all meal successfully',
        data: result,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Server err when get meals' });
      next(error);
    }
  };

  getMealDetailsByMemberId = async (req: Request, res: Response, next: NextFunction) => {
    const { memberId } = req.params;
    try {
      const result = await mealService.getMealDetailsByMemberId(memberId);
      res.status(200).json({
        statusText: 'SUCCESS',
        message: 'Get single meal successfully',
        data: result,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Server err when get single meals by id' });
      next(error);
    }
  };

  addMeal = async (req: Request, res: Response, next: NextFunction) => {
    const memberId = req.body.member_id as string;
    const mealCount = Number(req.body.meal_count);

    try {
      const result = await mealService.addMeal(memberId, mealCount);
      res.status(200).json({
        statusText: 'SUCCESS',
        message: 'Add meal successfully',
        data: result,
      });
    } catch (error) {
      logger.error('Error when add a meal', {
        input: req.body,
        error,
      });
      next(error);
    }
  };

  updateMealByRid = async (req: Request, res: Response, next: NextFunction) => {
    const rid = req.params.rid;
    const { mealCount } = req.body;
    try {
      const result = await mealService.updateMealByRid(rid, mealCount);
      res.status(200).json({
        statusText: 'SUCCESS',
        message: 'Meal updated successfully',
        data: result,
      });
    } catch (error) {
      logger.error('Failed to update deposit', {
        input: req.body,
        error,
      });
      next(error);
    }
  };
}

export default new MealController();
