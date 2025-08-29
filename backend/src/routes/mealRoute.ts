import express from 'express';
import mealController from '../controllers/mealController';

const router = express.Router();

router.get('/', mealController.getMeals);
router.get('/:memberId', mealController.getMealDetailsByMemberId);
router.post('/', mealController.addMeal);
router.patch('/:rid', mealController.updateMealByRid);

export default router;
