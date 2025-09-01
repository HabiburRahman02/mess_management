'use client';
import React from 'react';
import { mealRateService } from '@/services/mealRateService';
import { monthString } from '@/utils/currentMonth';
import { useQuery } from '@tanstack/react-query';
import MealRateStatCard from './MealRateStatCard';
import {
  AiOutlineCalendar,
  AiOutlineDollar,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from 'react-icons/ai';

type MealRate = {
  month: string;
  total_bazar_cost: string;
  total_meals: string;
  meal_rate: string;
};

const MealRateStats: React.FC = () => {
  const {
    data: mealRate,
    isLoading,
    isError,
    error,
  } = useQuery<MealRate[]>({
    queryKey: ['meal-rate', monthString],
    queryFn: () => mealRateService.getMealRate(monthString),
  });

  console.log('meal rate', mealRate);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="p-4">
      {mealRate?.map((meal, idx) => (
        <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <MealRateStatCard
            title="Month"
            value={meal?.month || 'N/A'}
            icon={<AiOutlineCalendar />}
          />
          <MealRateStatCard
            title="Total Bazar Cost"
            value={meal.total_bazar_cost || 'N/A'}
            icon={<AiOutlineShoppingCart />}
          />
          <MealRateStatCard
            title="Total Meal"
            value={meal.total_meals || 'N/A'}
            icon={<AiOutlineUser />}
          />
          <MealRateStatCard
            title="Meal Rate"
            value={meal.meal_rate || 'N/A'}
            icon={<AiOutlineDollar />}
          />
        </div>
      ))}
    </div>
  );
};

export default MealRateStats;
