import axiosInstance from '@/api/axiosInstance';

export const mealRateService = {
  getMealRate: async (monthString: string) => {
    const result = await axiosInstance.get(`/meal-rate?month=${monthString}`);
    return result?.data?.data;
  },

  getMealStatsPerMember: async (monthString: string) => {
    const result = await axiosInstance.get(`/meal-rate/single-meal-stats?month=${monthString}`);
    return result?.data?.data;
  },
};
