import mealRepository from '../repositories/mealRepository';

class MealService {
  getMeals = async () => {
    return await mealRepository.getMeals();
  };

  getMealDetailsByMemberId = async (memberId: string) => {
    return await mealRepository.getMealDetailsByMemberId(memberId);
  };

  addMeal = async (memberId: string, mealCount: number) => {
    return await mealRepository.addMeal(memberId, mealCount);
  };

  updateMealByRid = async (rid: string, mealCount: number) => {
    return await mealRepository.updateMealByRid(rid, mealCount);
  };
}

export default new MealService();
