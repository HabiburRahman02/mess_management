import axiosInstance from '@/api/axiosInstance';

export const mealRateService = {
  getMealRate: async () => {
    const result = await axiosInstance.get('/meal-rate?month=2025-08');
    return result?.data?.data;
  },
};
