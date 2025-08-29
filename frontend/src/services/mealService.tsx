import axiosInstance from '@/api/axiosInstance';

export const mealService = {
  getMeals: async () => {
    const result = await axiosInstance.get('/meals');
    return result?.data?.data;
  },

  getMealByMemberId: async (memberId: string | null) => {
    const result = await axiosInstance.get(`/meals/${memberId}`);
    return result?.data?.data;
  },

  addMeal: async ({ member_id, meal_count }: { member_id: string; meal_count: string }) => {
    const res = await axiosInstance.post('/meals', { member_id, meal_count });
    return res?.data?.data;
  },
};
