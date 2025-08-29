import mealRateRepository from '../repositories/mealRateRepository';

class MealRateService {
  getMealRate = async (month: string) => {
    return await mealRateRepository.getMealRate(month);
  };
}

export default new MealRateService();
