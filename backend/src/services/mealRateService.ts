import mealRateRepository from '../repositories/mealRateRepository';

class MealRateService {
  getMealRate = async (month: string) => {
    return await mealRateRepository.getMealRate(month);
  };
  getPerMemberMealStatsByMonth = async (month: string) => {
    return await mealRateRepository.getPerMemberMealStatsByMonth(month);
  };
}

export default new MealRateService();
