import express from 'express';
import mealRateController from '../controllers/mealRateController';

const router = express.Router();

router.get('/', mealRateController.getMealRate);
router.get('/single-meal-stats', mealRateController.getPerMemberMealStatsByMonth)


export default router;
