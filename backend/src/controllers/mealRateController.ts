import { NextFunction, Request, Response } from 'express';
import mealRateService from '../services/mealRateService';
import { logger } from '../utilities/logger';

class MealRateController {
  getMealRate = async (req: Request, res: Response, next: NextFunction) => {
    const month = req.query.month as string;
    try {
      const result = await mealRateService.getMealRate(month);
      res.status(200).json({
        statusText: 'SUCCESS',
        message: 'Get meal rate successfully',
        data: result,
      });
    } catch (error) {
      logger.error('Error when get meal rate', {
        input: req.body,
        error,
      });
      next(error);
    }
  };
}

export default new MealRateController();
